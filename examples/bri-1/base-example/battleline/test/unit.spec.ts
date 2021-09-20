import { setBoatLocation, randomiseBoatLocation, newBoard, boat, launchMisile, checkDamage, checkGame } from '../src';
import { randomIntFromInterval } from '../src/utils';

import { assert, expect } from 'chai';

describe('Battle Line', () => {
  describe('Baseline', () => {
    
  })

  describe('Battleship', () => {
    let bobBoardInstance
    let bobCruiser
    let aliceBoardInstance
    let aliceCruiser
    describe('Setup', () => {
      describe('Bob', () => {
        let bobDestroyer
        let bobFrigate

        it('should generate a board', async () => {
          bobBoardInstance = await newBoard(3, 3, 'Bob');
          let randomRow = await randomIntFromInterval(1, 3)
          let randomColumn = await randomIntFromInterval(1, 3)

          expect(bobBoardInstance.properties.rows).to.equal(3);
          expect(bobBoardInstance.properties.columns).to.equal(3);
          expect(bobBoardInstance.properties.numberOfBoats).to.equal(0);
          expect(bobBoardInstance.grid[`${randomRow},${randomColumn}`]).to.equal(false)
        });

        it('should generate a boat instance', async () => {
          bobCruiser = await boat(1, 'bobCruiser', bobBoardInstance);
          bobDestroyer = await boat(2, 'bobDestroyer', bobBoardInstance);
          bobFrigate = await boat(3, 'bobFrigate', bobBoardInstance);

          expect(bobCruiser.name).to.equal('bobCruiser')
          expect(bobCruiser.size).to.equal(1)
          expect(bobCruiser.position).to.deep.equal([])
        });

        it('should place a boat in the board in a specific location', async () => {
          bobBoardInstance = await setBoatLocation(1, 1, 'vertical', bobCruiser, bobBoardInstance, null);

          expect(bobBoardInstance.grid[`1,1`]).to.equal(true)
          expect(bobBoardInstance.properties.numberOfBoats).to.equal(1);
          expect(bobBoardInstance.properties.boats).to.be.an('array');
          expect(bobCruiser.position[0].location).to.deep.equal('1,1')
        });

        it('should only position a boat once', async () => {
          bobBoardInstance = await setBoatLocation(2, 2, 'horizontal', bobCruiser, bobBoardInstance, randomiseBoatLocation);

          expect(bobBoardInstance.grid[`1,1`]).to.equal(true)
          expect(bobBoardInstance.grid[`2,2`]).to.equal(false)
          expect(bobBoardInstance.properties.numberOfBoats).to.equal(1);
          expect(bobCruiser.position[0].location).to.deep.equal('1,1')
        });

        it('should randomly place a boat in the board', async () => {
          bobBoardInstance = await randomiseBoatLocation(bobDestroyer, bobBoardInstance);
          let randomPosition = bobDestroyer.position
          expect(bobBoardInstance.grid[`${randomPosition[0].location}`]).to.equal(true)
          expect(bobBoardInstance.grid[`${randomPosition[1].location}`]).to.equal(true)
          expect(bobBoardInstance.properties.numberOfBoats).to.equal(2);
        });

        it('should not have any boats superimposed', async () => {
          bobBoardInstance = await setBoatLocation(1, 1, 'vertical', bobFrigate, bobBoardInstance, null);
          assert(bobBoardInstance, 'should have placed a boat on the board');

          expect(bobCruiser.position[0].location).to.deep.equal('1,1')
          expect(bobFrigate.position).to.deep.equal([])
          expect(bobBoardInstance.properties.numberOfBoats).to.equal(2);
        });
      })

      describe('Alice', () => {
        it('should generate a board', async () => {
          aliceBoardInstance = await newBoard(3, 3, 'Alice');
          let randomRow = await randomIntFromInterval(1, 3)
          let randomColumn = await randomIntFromInterval(1, 3)

          expect(aliceBoardInstance.properties.rows).to.equal(3);
          expect(aliceBoardInstance.properties.columns).to.equal(3);
          expect(aliceBoardInstance.properties.numberOfBoats).to.equal(0);
          expect(aliceBoardInstance.grid[`${randomRow},${randomColumn}`]).to.equal(false)
        });

        it('should generate a boat instance', async () => {
          aliceCruiser = await boat(1, 'aliceCruiser', aliceBoardInstance);

          expect(aliceCruiser.name).to.equal('aliceCruiser')
          expect(aliceCruiser.size).to.equal(1)
          expect(aliceCruiser.position).to.deep.equal([])
        });

        it('should place a boat in the board in a specific location', async () => {
          aliceBoardInstance = await setBoatLocation(1, 1, 'vertical', aliceCruiser, aliceBoardInstance, null);

          expect(aliceBoardInstance.grid[`1,1`]).to.equal(true)
          expect(aliceBoardInstance.properties.numberOfBoats).to.equal(1);
          expect(aliceCruiser.position[0].location).to.deep.equal('1,1')
        });
      })

      describe('In game Logic', () => {
        it('should manage the turns logic between users', async () => {
          // manage the users turn control
        })

        it('should launch a misile and miss', async () => {
          let bobTurn = await launchMisile(2, 1, aliceBoardInstance)

          expect(aliceBoardInstance.properties.boats[0].position[0].state).to.equal(null)
          expect(bobTurn).to.equal('miss')
        })

        it('should launch a misile and hit a boat', async () => {
          let aliceTurn = await launchMisile(1, 1, bobBoardInstance)

          expect(bobBoardInstance.properties.boats[0].position[0].state).to.equal('hit')
          expect(aliceTurn).to.equal('hit')
        })

        it('should check whether a boat has been sunk', async () => {
          await checkDamage(bobBoardInstance)

          expect(bobBoardInstance.properties.boats[0].state).to.equal('sunk')
        })

        it('should finish a game when no more boats are standing. ', async () => {
          let game = await checkGame(bobBoardInstance)

          expect(game.gameState).to.equal('pending')
        })
      })
    })
  });
})