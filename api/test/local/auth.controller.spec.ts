import * as request from 'supertest';
import { verify } from 'jsonwebtoken';
import { INestApplication } from '@nestjs/common';
import { UserService } from '../../src/user/user.service';
import { clearDB } from '../utils';
import { Role } from '@prisma/client';
import { Test } from '@nestjs/testing';
import { expect } from 'chai';
import { UserModule } from '../../src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';

describe('AuthController', async () => {
  let app: INestApplication;
  let userService: UserService;
  let reqTest: request.SuperAgentTest;
  const userDto = {
    email: 'apple@utoronto.ca',
    password: '123',
    role: Role.USER,
  };
  let access_token: string;

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
  });

  it(`/Post login`, async () => {
    await reqTest
      .post('/auth/login')
      .set('Accept', 'application/json')
      .send(userDto)
      .expect((response: request.Response) => {
        const token = response.body.access_token;
        expect(verify(token, process.env.JWT_ACCESS_SECRET)).to.be.ok;
      });
  });

  it(`/Get proflie`, async () => {
    await reqTest
      .post('/auth/login')
      .set('Accept', 'application/json')
      .send(userDto)
      .expect((response: request.Response) => {
        access_token = response.body.access_token;
        expect(verify(access_token, process.env.JWT_ACCESS_SECRET)).to.be.ok;
      });

    await reqTest
      .get('/auth/profile')
      .set('Authorization', `Bearer ${access_token}`)
      .expect(async (response: request.Response) => {
        const userId = response.body.userId;
        const loginUser = await userService.getUserById(userId);
        expect(loginUser.email).to.equal(userDto.email);
      });
  });

  after(async () => {
    await app.close();
  });
});
