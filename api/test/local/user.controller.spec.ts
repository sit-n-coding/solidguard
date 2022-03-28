import * as request from 'supertest';
import { verify } from 'jsonwebtoken';
import { INestApplication } from '@nestjs/common';
import { UserService } from '../../src/user/user.service';
import { clearDB } from '../utils';
import { Role, User } from '@prisma/client';
import { Test } from '@nestjs/testing';
import { expect } from 'chai';
import { UserModule } from '../../src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';

describe('UserController', async () => {
  let app: INestApplication;
  let userService: UserService;
  let reqTest: request.SuperAgentTest;
  const registerUserDto = {
    email: 'user@utoronto.ca',
    password: 'fau39fh12kf*T#&',
  };
  const userDto = {
    email: 'apple@utoronto.ca',
    password: '123',
    role: Role.USER,
  };
  const adminDto = {
    email: 'admin@utoronto.ca',
    password: '456',
    role: Role.ADMIN,
  };
  let access_token: string;
  let createUser: User;
  const createUserAsExistingAdmin = {
    email: 'user_created_by_admin@utoronto.ca',
    password: 'fsaus*&h92',
    role: Role.USER,
  };
  let createAdmin: User;
  const createAdminAsExistingAdmin = {
    email: 'admin_created_by_admin@utoronto.ca',
    password: 'dfasuh23&#',
    role: Role.ADMIN,
  };

  before(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        UserModule,
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule.forRoot({
          isGlobal: true,
        }),
      ],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    userService = moduleRef.get<UserService>(UserService);
    reqTest = request.agent(app.getHttpServer());
  });

  beforeEach(async () => {
    await clearDB();
    await userService.createAccount(userDto);
    await userService.createAccount(adminDto);
  });
  describe('/Post registerUser', () => {
    it(`Register a new User account`, async () => {
      await reqTest
        .post('/user/register')
        .set('Accept', 'application/json')
        .send(registerUserDto);

      expect(
        (await userService.getUserByEmail(registerUserDto.email)).email
      ).to.equal(registerUserDto.email);

      await reqTest
        .post('/auth/login')
        .set('Accept', 'application/json')
        .send(registerUserDto)
        .expect((response: request.Response) => {
          const token = response.body.access_token;
          expect(verify(token, process.env.JWT_ACCESS_SECRET)).to.be.ok;
        });
    });
  });
  describe('/Post createAccount', () => {
    beforeEach(async () => {
      await reqTest
        .post('/auth/login')
        .set('Accept', 'application/json')
        .send(adminDto)
        .expect((response: request.Response) => {
          access_token = response.body.access_token;
          expect(verify(access_token, process.env.JWT_ACCESS_SECRET)).to.be.ok;
        });
    });

    it(`/Post Create User Account`, async () => {
      await reqTest
        .post('/user/create-new-account')
        .set('Authorization', `Bearer ${access_token}`)
        .send(createUserAsExistingAdmin)
        .expect((response: request.Response) => {
          createUser = response.body;
        });
      const newCreatedUser = await userService.getUserById(createUser.id);
      expect(newCreatedUser).to.not.be.null;
      expect(newCreatedUser.email).to.equal(createUserAsExistingAdmin.email);
      expect(newCreatedUser.role)
        .to.equal(createUserAsExistingAdmin.role)
        .to.equal(Role.USER);
    });

    it(`/Post Create Admin Account`, async () => {
      await reqTest
        .post('/user/create-new-account')
        .set('Authorization', `Bearer ${access_token}`)
        .send(createAdminAsExistingAdmin)
        .expect((response: request.Response) => {
          createAdmin = response.body;
        });
      const newCreatedUser = await userService.getUserById(createAdmin.id);
      expect(newCreatedUser).to.not.be.null;
      expect(newCreatedUser.email).to.equal(createAdminAsExistingAdmin.email);
      expect(newCreatedUser.role)
        .to.equal(createAdminAsExistingAdmin.role)
        .to.equal(Role.ADMIN);
    });

    it(`/Post Create Account fail as User Login`, async () => {
      await reqTest
        .post('/auth/login')
        .set('Accept', 'application/json')
        .send(userDto)
        .expect((response: request.Response) => {
          access_token = response.body.access_token;
          expect(verify(access_token, process.env.JWT_ACCESS_SECRET)).to.be.ok;
        });

      await reqTest
        .post('/user/create-new-account')
        .set('Authorization', `Bearer ${access_token}`)
        .send(createAdminAsExistingAdmin);
      const newCreatedUser = await userService.getUserByEmail(
        'admin_created_by_admin@utoronto.ca'
      );
      expect(newCreatedUser).to.be.null;
    });
  });

  after(async () => {
    await app.close();
  });
});
