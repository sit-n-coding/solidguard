import * as bcrypt from 'bcrypt';
import { TestingModule } from '@nestjs/testing';
import { UserService } from '../src/user/user.service';
import { clearDB, getModuleRef } from './utils';
import { Role } from '@prisma/client';

describe('UserService', () => {
  let userService: UserService;
  let moduleRef: TestingModule;
  const createAccountDtoUser = {
    name: 'anime@toronto.ca',
    password: 'Happy123',
    role: Role.USER,
  };
  const createAccountDtoAdmin = {
    name: 'admin@toronto.ca',
    password: 'pOw$er37&',
    role: Role.USER,
  };

  beforeAll(async () => {
    moduleRef = await getModuleRef();
    userService = moduleRef.get<UserService>(UserService);
    await clearDB();
  });

  describe('userService Test', () => {
    it('Create a new User Role Account', async () => {
      const user = await userService.createAccount(createAccountDtoUser);
      expect(user.name).toBe(createAccountDtoUser.name);
      expect(
        bcrypt.compareSync(createAccountDtoUser.password, user.password)
      ).toBe(true);
      expect(user.role).toBe(createAccountDtoUser.role);
    });

    it('Create a new Admin Role Account', async () => {
      const user = await userService.createAccount(createAccountDtoAdmin);
      expect(user.name).toBe(createAccountDtoAdmin.name);
      expect(
        bcrypt.compareSync(createAccountDtoAdmin.password, user.password)
      ).toBe(true);
      expect(user.role).toBe(createAccountDtoAdmin.role);
    });
  });
});
