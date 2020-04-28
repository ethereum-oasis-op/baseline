import { zokratesServiceFactory } from '../src/index';

let zokrates;

beforeEach(() => {
  zokrates = zokratesServiceFactory();
});

// describe('when the underlying zokrates provider is unavailable', async () => {
//   beforeEach(() => {
//     // TODO: stub zokratesServiceFactory();
//   });
// });

// describe('when the underlying zokrates provider is available', async () => {
//   test('compile', async () => {
//     const artifact = zokrates.compile();
//     console.log(artifact);
//   });
// });
