import * as bcrypt from 'bcrypt';
import { TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import { UserService } from '../../src/user/user.service';
import { clearDB, getModuleRef } from '../utils';
import { Role } from '@prisma/client';

describe('UserService', () => {
  let userService: UserService;
  let moduleRef: TestingModule;
  const createAccountDtoUser = {
    email: 'anime@toronto.ca',
    password: 'Happy123',
    role: Role.USER,
  };
  const createAccountDtoAdmin = {
    email: 'admin@toronto.ca',
    password: 'pOw$er37&',
    role: Role.USER,
  };

  before(async () => {
    moduleRef = await getModuleRef();
    userService = moduleRef.get<UserService>(UserService);
    await clearDB();
  });

  describe('userService Test', () => {
    it('Create a new User Role Account', async () => {
      const user = await userService.createAccount(createAccountDtoUser);
      expect(user.email).to.equal(createAccountDtoUser.email);
      expect(bcrypt.compareSync(createAccountDtoUser.password, user.password))
        .to.be.true;
      expect(user.role).to.equal(createAccountDtoUser.role);
    });

    it('Create a new Admin Role Account', async () => {
      const user = await userService.createAccount(createAccountDtoAdmin);
      expect(user.email).to.equal(createAccountDtoAdmin.email);
      expect(bcrypt.compareSync(createAccountDtoAdmin.password, user.password))
        .to.be.true;
      expect(user.role).to.equal(createAccountDtoAdmin.role);
    });
  });
});
