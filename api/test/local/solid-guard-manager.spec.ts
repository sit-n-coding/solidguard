import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';
import { expectAnyAsyncError } from '../utils';

// signers
let manager: SignerWithAddress;
let wallets: SignerWithAddress[];

// contracts
let solidGuardManager: Contract;
let zeroApps: Contract[2] = [];

describe('SolidGuardManager', () => {
  beforeEach(async () => {
    zeroApps = [];
    [manager, ...wallets] = await ethers.getSigners();
    const SolidGuardManager = await ethers.getContractFactory(
      'SolidGuardManager'
    );
    const ZeroApp = await ethers.getContractFactory('ZeroApp');
    solidGuardManager = await SolidGuardManager.connect(manager).deploy();
    zeroApps.push(
      await ZeroApp.connect(wallets[0]).deploy(solidGuardManager.address)
    );
    zeroApps.push(
      await ZeroApp.connect(wallets[1]).deploy(solidGuardManager.address)
    );
  });
  describe('deposit + getPauses', () => {
    it('Deposit for 1 Pause', async () => {
      const bal0 = await manager.getBalance();
      await solidGuardManager
        .connect(wallets[0])
        .deposit([zeroApps[0].address], [1], {
          value: ethers.utils.parseEther('0.01'),
        });
      const bal1 = await manager.getBalance();
      expect(bal1.sub(bal0).toString()).to.equal(
        ethers.utils.parseEther('0.01').toString()
      );
      expect(
        (await solidGuardManager.getPauses(zeroApps[0].address)).toString()
      ).to.equal('1');
    });
    it('Deposit for 2 Pauses on the same dApp', async () => {
      const bal0 = await manager.getBalance();
      await solidGuardManager
        .connect(wallets[0])
        .deposit([zeroApps[0].address], [2], {
          value: ethers.utils.parseEther('0.02'),
        });
      const bal1 = await manager.getBalance();
      expect(bal1.sub(bal0).toString()).to.equal(
        ethers.utils.parseEther('0.02').toString()
      );
      expect(
        (await solidGuardManager.getPauses(zeroApps[0].address)).toString()
      ).to.equal('2');
    });
    it('Deposit for 2 Pauses on different dApps', async () => {
      const bal0 = await manager.getBalance();
      await solidGuardManager
        .connect(wallets[0])
        .deposit([zeroApps[0].address, zeroApps[1].address], [1, 1], {
          value: ethers.utils.parseEther('0.02'),
        });
      const bal1 = await manager.getBalance();
      expect(bal1.sub(bal0).toString()).to.equal(
        ethers.utils.parseEther('0.02').toString()
      );
      expect(
        (await solidGuardManager.getPauses(zeroApps[0].address)).toString()
      ).to.equal('1');
      expect(
        (await solidGuardManager.getPauses(zeroApps[1].address)).toString()
      ).to.equal('1');
    });
    it('Insufficient ETH', async () => {
      const bal0 = await manager.getBalance();
      await expectAnyAsyncError(
        solidGuardManager
          .connect(wallets[0])
          .deposit([zeroApps[0].address, zeroApps[1].address], [1, 1], {
            value: ethers.utils.parseEther('0.01'),
          })
      );
      const bal1 = await manager.getBalance();
      expect(bal1.sub(bal0).toString()).to.equal('0');
      expect(
        (await solidGuardManager.getPauses(zeroApps[0].address)).toString()
      ).to.equal('0');
      expect(
        (await solidGuardManager.getPauses(zeroApps[1].address)).toString()
      ).to.equal('0');
    });
  });
  describe('batchPause', () => {
    it('Pause/unpause zero apps', async () => {
      await solidGuardManager
        .connect(wallets[0])
        .deposit([zeroApps[0].address, zeroApps[1].address], [1, 1], {
          value: ethers.utils.parseEther('0.02'),
        });
      await solidGuardManager
        .connect(manager)
        .batchPause([zeroApps[0].address, zeroApps[1].address]);
      await expectAnyAsyncError(zeroApps[0].zero());
      await expectAnyAsyncError(zeroApps[1].zero());
    });
    it('Revert on pausing a contract with 0 pauses', async () => {
      await expectAnyAsyncError(
        solidGuardManager.connect(manager).batchPause([zeroApps[0].address])
      );
      expect((await zeroApps[0].zero()).toString()).to.equal('0');
    });
  });
});
