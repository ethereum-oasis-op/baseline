import { BaselineApp } from '../src/index';
import { assert } from 'console';

let alice: BaselineApp | null;
let bob: BaselineApp | null;

// beforeEach(async () => {
//   // alice = new BaselineApp({}, {
//   //   sServers: ['nats://localhost:4222'],
//   // });

//   // bob = new BaselineApp({}, {
//   //   servers: ['nats://localhost:4224'],
//   // });
// });

// afterEach(async () => {
//   // alice = null;
//   // bob = null;
// });

// describe('baselining a record', () => {
//   let app;

//   beforeEach(async () => {
//     assert(app, 'baseline app not initialized');
//   });

//   describe('baseline circuit', () => {
//     let circuitArtifacts;

//     beforeEach(async () => {
//       circuitArtifacts = app.circuitArtifacts;
//     });
//   });
// });
