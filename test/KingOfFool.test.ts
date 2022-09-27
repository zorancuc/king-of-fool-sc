import { expect } from 'chai'
import { ethers } from 'hardhat'
import { Signer, utils } from "ethers";
import '@nomiclabs/hardhat-ethers'

import { KingOfFool__factory, KingOfFool } from '../build/types'

const { getContractFactory, getSigners } = ethers

describe('King Of Fool', () => {
  let kingOfFool: KingOfFool

  let signerUserA;
  let signerUserB;
  let signerUserC;

  let userA;
  let userB;
  let userC;

  beforeEach(async () => {
    // 1
    const signers = await getSigners()

    userA = await signers[1].getAddress();
    userB = await signers[2].getAddress();
    userC = await signers[3].getAddress();

    signerUserA = signers[1];
    signerUserB = signers[2];
    signerUserC = signers[3];

    // 2
    const kingOfFoolFactory = (await getContractFactory('KingOfFool', signers[0])) as KingOfFool__factory
    kingOfFool = await kingOfFoolFactory.deploy();
    await kingOfFool.deployed()

    expect(await kingOfFool.amountOfFool()).to.eq(0);
  })

  // 4
  describe('deposit ETH', async () => {
    it('deposit for the first time ', async () => {
      const depositAmount = utils.parseUnits('1', 18)
      
      const tx = await kingOfFool.connect(signerUserA).depositETH({value: depositAmount });
      await expect(tx).to.emit(kingOfFool, "DepositETH").withArgs(userA, "0x0000000000000000000000000000000000000000", depositAmount);
      expect(await kingOfFool.amountOfFool()).to.eq(depositAmount);
      expect(await kingOfFool.addrOfFool()).to.eq(userA);
      
    })

    it('deposit failed becasue of insufficient amount ', async () => {
      const depositAmount = utils.parseUnits('1', 18)
      
      await kingOfFool.connect(signerUserA).depositETH({value: depositAmount });
      expect(await kingOfFool.amountOfFool()).to.eq(depositAmount);
      expect(await kingOfFool.addrOfFool()).to.eq(userA);

      // const tx = kingOfFool.connect(signerUserB).depositETH({value: depositAmount });
      await expect(
        kingOfFool.connect(signerUserB).depositETH({value: depositAmount })
      ).to.be.revertedWith('KingOfFool: INSUFFICIENT AMOUNT');
      
      expect(await kingOfFool.amountOfFool()).to.eq(depositAmount);
      expect(await kingOfFool.addrOfFool()).to.eq(userA);
    })

    it('deposit greater amount sucess', async () => {
      const depositAmountA = utils.parseUnits('1', 18)
      
      await kingOfFool.connect(signerUserA).depositETH({value: depositAmountA });
      expect(await kingOfFool.amountOfFool()).to.eq(depositAmountA);
      expect(await kingOfFool.addrOfFool()).to.eq(userA);

      const depositAmountB = utils.parseUnits('2', 18);
      const balanceOfUserABefore = await ethers.provider.getBalance(userA);
      const tx = await kingOfFool.connect(signerUserB).depositETH({value: depositAmountB })
      await expect(tx).to.emit(kingOfFool, "DepositETH").withArgs(userB, userA, depositAmountB);
      
      const balanceOfUserAAfter = await ethers.provider.getBalance(userA);

      expect(await kingOfFool.amountOfFool()).to.eq(depositAmountB);
      expect(await kingOfFool.addrOfFool()).to.eq(userB);
      expect(balanceOfUserAAfter.sub(balanceOfUserABefore)).to.eq(depositAmountB);
    })
  })
})
