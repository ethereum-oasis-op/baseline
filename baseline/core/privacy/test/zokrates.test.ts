import { zokratesServiceFactory } from '../src/index';

let zokrates;

beforeEach(async () => {
  zokrates = await zokratesServiceFactory();
  console.log(zokrates);
});

describe('when the underlying zokrates provider is unavailable', async () => {
  beforeEach(() => {
    // TODO: stub zokratesServiceFactory();
  });
});

describe('when the underlying zokrates provider is available', async () => {
  it('should compile', async () => {
    const artifact = zokrates.compile();
    console.log(artifact);
  });
});
