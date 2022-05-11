import { TestingModule } from '@nestjs/testing';
import { UserService } from '../src/user/user.service';
import { ContractDAO } from '../src/contract/contract.dao';
import { SubscribeService } from '../src/subscribe/subscribe.service';
import { clearDB, getModuleRef } from './utils';
import { Role } from '@prisma/client';

describe('SubscribeService', () => {
  let subscribeService: SubscribeService;
  let contractDAO: ContractDAO;
  let moduleRef: TestingModule;
  const emailAddr1 = 'e1';
  const contractAddr1 = 'c1';
  let subDto = {
    emailAddrs: [emailAddr1],
    contractAddrs: [contractAddr1],
    userId: 'generate-in-postgres',
  };
  let multSubDto = {
    emailAddrs: ['email1', 'email2'],
    contractAddrs: ['contract1', 'contract2'],
    userId: 'generate-in-postgres',
  };

  beforeEach(async () => {
    moduleRef = await getModuleRef();
    subscribeService = moduleRef.get<SubscribeService>(SubscribeService);
    contractDAO = moduleRef.get<ContractDAO>(ContractDAO);
    const userService = moduleRef.get<UserService>(UserService);
    await clearDB();
    // update all exploitDtos to use user.id
    const user = await userService.createAccount({
      name: 'x',
      password: 'y',
      role: Role.USER,
    });
    subDto = { ...subDto, userId: user.id };
    multSubDto = { ...multSubDto, userId: user.id };

    for (const addr of subDto.contractAddrs.concat(multSubDto.contractAddrs)) {
      await contractDAO.create({ addr, pauseable: false });
    }
  });
  describe('getContractsByEmail', () => {
    it('Get a contract by email', async () => {
      await subscribeService.createSubscribe(subDto);
      const contract = await subscribeService.getContractsByEmail(
        subDto.emailAddrs[0]
      );
      await expect('c1').toEqual(contract[0]);
    });
    it('if given email DNE', async () => {
      const DNEsub = await subscribeService.getContractsByEmail('DNE');
      expect(DNEsub[0]).toBeUndefined();
    });

    it('if have multiple subs', async () => {
      await subscribeService.createSubscribe(multSubDto);
      const contracts = await subscribeService.getContractsByEmail(
        multSubDto.emailAddrs[0]
      );
      await expect(contracts).toEqual(
        expect.arrayContaining(['contract2', 'contract1'])
      );
    });
  });

  describe('getEmailsByContract', () => {
    it('Get an email by contract', async () => {
      await subscribeService.createSubscribe(subDto);
      const email = await subscribeService.getEmailsByContract(
        subDto.contractAddrs[0]
      );
      await expect('e1').toEqual(email[0]);
    });
    it('if given contract DNE', async () => {
      const DNEsub = await subscribeService.getEmailsByContract('DNE');
      expect(DNEsub[0]).toBeUndefined();
    });
    it('if have multiple subs', async () => {
      await subscribeService.createSubscribe(multSubDto);
      const emails = await subscribeService.getEmailsByContract(
        multSubDto.contractAddrs[0]
      );
      await expect(emails).toEqual(
        expect.arrayContaining(['email2', 'email1'])
      );
    });
  });

  describe('getSubscribeByUser', () => {
    it('Get a dashboard item of the user', async () => {
      await subscribeService.createSubscribe(subDto);
      const sub = await subscribeService.getSubscribeByUser(subDto.userId, 1);
      expect('e1').toEqual(sub[0].emailAddr);
      expect('c1').toEqual(sub[0].contractAddr);
      expect(subDto.userId).toEqual(sub[0].userId);
    });
    it('if given user DNE', async () => {
      const DNEsub = await subscribeService.getSubscribeByUser('DNE', 1);
      expect(DNEsub[0]).toBeUndefined();
    });
    it('if have multiple subs', async () => {
      await subscribeService.createSubscribe(multSubDto);
      const sub = await subscribeService.getSubscribeByUser(subDto.userId, 1);
      const subContracts = [
        sub[0].contractAddr,
        sub[1].contractAddr,
        sub[2].contractAddr,
        sub[3].contractAddr,
      ];
      expect(subContracts).toEqual(
        expect.arrayContaining(['contract1', 'contract2'])
      );

      const subEmails = [
        sub[0].emailAddr,
        sub[1].emailAddr,
        sub[2].emailAddr,
        sub[3].emailAddr,
      ];
      expect(subEmails).toEqual(expect.arrayContaining(['email1', 'email2']));

      expect(subDto.userId).toEqual(sub[0].userId);
      expect(subDto.userId).toEqual(sub[2].userId);
    });
  });

  afterEach(async () => {
    await clearDB();
  });
});
