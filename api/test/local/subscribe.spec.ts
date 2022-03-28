import { TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import { ContractDAO } from '../../src/contract/contract.dao';
import { SubscribeService } from '../../src/subscribe/subscribe.service';
import { clearDB, getModuleRef } from '../utils';

describe('SubscribeService', () => {
  let subscribeService: SubscribeService;
  let contractDAO: ContractDAO;
  let moduleRef: TestingModule;
  const emailAddr1 = 'e1';
  const contractAddr1 = 'c1';
  const subDto = {
    emailAddrs: [emailAddr1],
    contractAddrs: [contractAddr1],
  };
  const multSubDto = {
    emailAddrs: ['email1', 'email2'],
    contractAddrs: ['contract1', 'contract2'],
  };

  beforeEach(async () => {
    moduleRef = await getModuleRef();
    subscribeService = moduleRef.get<SubscribeService>(SubscribeService);
    contractDAO = moduleRef.get<ContractDAO>(ContractDAO);
    await clearDB();
    for (const addr of subDto.contractAddrs.concat(multSubDto.contractAddrs)) {
      await contractDAO.create({ addr, pause: false });
    }
  });
  describe('getContractsByEmail', () => {
    it('Get a contract by email', async () => {
      await subscribeService.createSubscribe(subDto);
      const contract = await subscribeService.getContractsByEmail(
        subDto.emailAddrs[0]
      );
      await expect('c1').to.eql(contract[0]);
    });
    it('if given email DNE', async () => {
      const DNEsub = await subscribeService.getContractsByEmail('DNE');
      expect(DNEsub[0]).to.be.undefined;
    });

    it('if have multiple subs', async () => {
      await subscribeService.createSubscribe(multSubDto);
      const contracts = await subscribeService.getContractsByEmail(
        multSubDto.emailAddrs[0]
      );
      await expect(contracts).to.include('contract2', 'contract1');
    });
  });

  describe('getEmailsByContract', () => {
    it('Get an email by contract', async () => {
      await subscribeService.createSubscribe(subDto);
      const email = await subscribeService.getEmailsByContract(
        subDto.contractAddrs[0]
      );
      await expect('e1').to.eql(email[0]);
    });
    it('if given contract DNE', async () => {
      const DNEsub = await subscribeService.getEmailsByContract('DNE');
      expect(DNEsub[0]).to.be.undefined;
    });
    it('if have multiple subs', async () => {
      await subscribeService.createSubscribe(multSubDto);
      const emails = await subscribeService.getEmailsByContract(
        multSubDto.contractAddrs[0]
      );
      await expect(emails).to.include('email2', 'email1');
    });
  });

  afterEach(async () => {
    await clearDB();
  });
});
