// import { BigInt } from "@graphprotocol/graph-ts"
// import {
//   ZKBattleship,
//   GameCreated,
//   GameStarted,
//   Placed,
//   ShotFired,
//   ShotLanded,
//   Won
// } from "../generated/ZKBattleship/ZKBattleship"
// import { ExampleEntity } from "../generated/schema"

// export function handleGameCreated(event: GameCreated): void {
//   // Entities can be loaded from the store using a string ID; this ID
//   // needs to be unique across all entities of the same type
//   let entity = ExampleEntity.load(event.transaction.from.toHex())

//   // Entities only exist after they have been saved to the store;
//   // `null` checks allow to create entities on demand
//   if (entity == null) {
//     entity = new ExampleEntity(event.transaction.from.toHex())

//     // Entity fields can be set using simple assignments
//     entity.count = BigInt.fromI32(0)
//   }

//   // BigInt and BigDecimal math are supported
//   entity.count = entity.count + BigInt.fromI32(1)

//   // Entity fields can be set based on event parameters
//   entity._room = event.params._room

//   // Entities can be written to the store with `.save()`
//   entity.save()

//   // Note: If a handler doesn't require existing field values, it is faster
//   // _not_ to load the entity from the store. Instead, create it fresh with
//   // `new Entity(...)`, set the fields that should be updated and save the
//   // entity back to the store. Fields that were not set or unset remain
//   // unchanged, allowing for partial updates to be applied.

//   // It is also possible to access smart contracts from mappings. For
//   // example, the contract that has emitted the event can be connected to
//   // with:
//   //
//   // let contract = Contract.bind(event.address)
//   //
//   // The following functions can then be called on this contract to access
//   // state variables and other data:
//   //
//   // - contract.WIDTH(...)
//   // - contract.WIN_HITS(...)
//   // - contract.createGame(...)
//   // - contract.gameLock(...)
//   // - contract.gameNonce(...)
//   // - contract.games(...)
//   // - contract.uuids(...)
// }

// export function handleGameStarted(event: GameStarted): void {}

// export function handlePlaced(event: Placed): void {}

// export function handleShotFired(event: ShotFired): void {}

// export function handleShotLanded(event: ShotLanded): void {}

// export function handleWon(event: Won): void {}

import { Bytes } from "@graphprotocol/graph-ts"
import { GameStarted, Placed, ShotFired, ShotLanded, Won } from "../generated/ZKBattleship/ZKBattleship"
import { Game, Move } from "../generated/schema"

export function handleGameCreated(event: GameStarted): void {
  let id = event.params._room.toHex();
  let game = new Game(id);
  game.moves = [];
  game.started = true;
  game.won = false;
  game.save();
}

export function handleShotFired(event: ShotFired): void {
  let id = event.params._room.toHex();
  let move_id = event.params._x.toString().concat('-').concat(event.params._y.toString());
  let move = new Move(move_id);
  move.by = event.params._by;
  move.landed = false;
  move.game = id;
  move.save();
}

export function handlePlaced(event: Placed): void {
  let id = event.params._room.toHex();
  let game = Game.load(id);
  let boards = new Array<Bytes>();
  
  if (game.boards[0]) {
    boards.push(game.boards[0]);
    boards.push(event.params._proof);
  } else {
    boards.push(event.params._proof);
  }
  game.boards = boards;
  game.save();
}

export function handleShotLanded(event: ShotLanded): void {
  let id = event.params._room.toHexString().concat('-').concat(event.params._x + event.params._y);
  let move = Move.load(id);
  move.landed = true;
  move.save();
}

export function handleWin(event: Won): void {
  let id = event.params._room.toHexString();
  let game = Game.load(id);
  game.won = true;
  game.winner = event.params._winner;
  game.save();
}