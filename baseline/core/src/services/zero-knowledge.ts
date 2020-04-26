import { initialize, ZoKratesProvider } from 'zokrates-js';

export interface ZeroKnowledgeService {
  setup(params: any): Promise<any>;
  sign(payload: string): Promise<any>;
  broadcast(payload: string, opts: any): Promise<any>;
  compile(params: any): Promise<any>;
  computeWitness(params: any): Promise<any>;
  exportVerifier(params: any): Promise<any>;
  verify(payload: string): Promise<any>;
  audit(params: any): Promise<any>;
}

const zokratesFactory = async (): Promise<ZoKratesProvider> => {
  return new Promise((resolve, reject) => {
    initialize()
      .then(zokrates => {
        resolve(zokrates);
      })
      .catch(err => {
        reject(err);
      });
  });
};

const importResolver = (location, path) => {
  return {
    source: 'def main() -> (): return',
    location: path,
  };
};

const compile = async (source, location) => {
  const zok = await zokratesFactory();
  zok.compile(source, location, importResolver);
};

const computeWitness = async (artifacts, args) => {
  const zok = await zokratesFactory();
  zok.computeWitness(artifacts, args);
};

const exportVerifier = async verifyingKey => {
  const zok = await zokratesFactory();
  zok.exportSolidityVerifier(verifyingKey, true);
};

const generateProof = async (circuit, witness, provingKey) => {
  const zok = await zokratesFactory();
  zok.generateProof(circuit, witness, provingKey);
};

const setup = async circuit => {
  const zok = await zokratesFactory();
  zok.setup(circuit);
};

// const verify = async () => {
//   // TODO: impl Verifier.at() here?
// };

export { compile, computeWitness, exportVerifier, generateProof, setup };

// export interface ResolverResult {
//   source: string,
//   location: string
// }

// export interface ComputationResult {
//   witness: string,
//   output: string
// }

// export interface CompilationArtifacts {
//   program: Uint8Array,
//   abi: string,
// }

// export interface SetupKeypair {
//   vk: string,
//   pk: Uint8Array,
// }


// FIXME-- adopt this typescript structure per init-core branch baseline/ package
// export class ZoKratesService implements ZeroKnowledgeService {

//   constructor() {}

//   private importResolver(location, path) {
//     return { 
//       source: 'def main() -> (): return',
//       location: path,
//     };
//   };

//   private async zokratesFactory() {
//     const zokrates = await initialize();
//     zokrates.compile()
  
//     return zokrates;
//   };
// }
