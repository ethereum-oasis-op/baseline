const { ethers } = require('hardhat')
const { expect } = require('chai');
const { encodeData } = require('./utils')

const boardStates = [
    '001000001000001000000000000000000000',
    '000000000000111000000000000000000000'
]

describe('Battle line demo', async () => {
    let signers
    let instance
    before('Deploy contracts', async () => {
        signers = await ethers.getSigners()
        const ZKBattleshipFactory = await ethers.getContractFactory('ZKBattleship');
        instance = await ZKBattleshipFactory.deploy()
        await instance.deployed()
    })
    it('Create game', async () => {
        const board = ethers.utils.sha256(`0x0${parseInt(boardStates[0], 2).toString(16).toUpperCase()}`)
        const proof = '0x00'
        const tx = await instance
            .connect(signers[0])
            .createGame(board, proof)
        await tx.wait()
        // await expect(tx)
        //     .to.emit(instance, 'GameCreated')
        //     .withArgs(1)
        // await expect(tx)
        //     .to.emit(instance, 'Placed')
        //     .withArgs(1, proof)
        const gamesData = await instance.games(1)
        // proof ommitted
        expect((gamesData.phase)).to.be.equal(1) // expect phase to be lobby
    })
    it('Join game', async () => {
        const board = ethers.utils.sha256(`0x${parseInt(boardStates[1], 2).toString(16).toUpperCase()}`)
        const proof = '0x00'
        const tx = await instance
            .connect(signers[1])
            .joinGame(1, board, proof)
        await tx.wait()
        const gamesData = await instance.games(1)
        // await expect(tx)
        //     .to.emit(instance, 'Placed')
        //     .withArgs(1, proof)
        // await expect(tx)
        //     .to.emit(instance, 'GameStarted')
        //     .withArgs(1)
        // proof ommitted
        expect((gamesData.phase)).to.be.equal(2) // expect phase to be lobby
    })
    it('Fire first shot', async () => {
        let gamesData = await instance.games(1)
        expect((gamesData.turn)).to.be.false
        const tx = await instance
            .connect(signers[1])
            .shoot(1, 1, 1, '0x00')
        await tx.wait()
        // await expect(tx)
        //    .to.emit(instance, 'ShotFired')
        //    .withArgs(1, 1, 1, signers[0].address)
        gamesData = await instance.games(1)
        expect((gamesData.turn)).to.be.true
    })
    it('Returning fire', async () => {
        // bob verifies alice miss, fires at alice
        let digest = await encodeData(
            ["uint8", "uint8", "bool", "bytes"],
            [1, 1, false, '0x00']
        )
        let tx = await instance
            .connect(signers[0])
            .shoot(1, 1, 3, digest)
        await tx.wait()
        // await expect(tx)
        //  .to.emit(instance, 'ShotLanded')
        //  .withArgs(1, 1, 1, '0x00')
        // await expect(tx)
        //  .to.emit(instance, 'ShotFired')
        //  .withArgs(1, 1, 3, signers[1].address)
        // alice verifies bob hit, fires at bob
        digest = await encodeData(
            ["uint8", "uint8", "bool", "bytes"],
            [1, 3, true, '0x00']
        )
        tx = await instance
            .connect(signers[1])
            .shoot(1, 1, 2, digest)
        await tx.wait()
        // await expect(tx)
        //  .to.emit(instance, 'ShotLanded')
        //  .withArgs(1, 1, 1, '0x00')
        // await expect(tx)
        //  .to.emit(instance, 'ShotFired')
        //  .withArgs(1, 1, 3, signers[1].address)
        
        // bob verifies alice miss, fires at alice
        digest = await encodeData(
            ["uint8", "uint8", "bool", "bytes"],
            [1, 2, false, '0x00']
        )
        tx = await instance
            .connect(signers[0])
            .shoot(1, 2, 3, digest)
        await tx.wait()
        // await expect(tx)
        //  .to.emit(instance, 'ShotLanded')
        //  .withArgs(1, 1, 1, '0x00')
        // await expect(tx)
        //  .to.emit(instance, 'ShotFired')
        //  .withArgs(1, 1, 3, signers[1].address)
        
        // alice verifies bob hit, fires at bob
        
    })
    xit('Exit condition', async () => {

    })
})