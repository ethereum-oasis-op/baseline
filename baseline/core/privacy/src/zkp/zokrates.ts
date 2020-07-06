import { initialize, ComputationResult, CompilationArtifacts, ResolveCallback, SetupKeypair, ZoKratesProvider } from 'zokrates-js';
import { IZKSnarkCircuitProvider } from '.';
import { readFileSync } from 'fs';

const defaultImportResolver = (location, path) => {
  let zokpath = `../../lib/circuits/baselineDocument/${path}`;
  if (!zokpath.match(/\.zok$/i)) {
    zokpath = `${zokpath}.zok`;
  }
  return {
    source: readFileSync(zokpath).toString(),
    location: path,
  };
};

export class ZokratesTrustedSetupArtifact {
  keypair?: SetupKeypair;
  verifierSource?: string;
}

export class ZoKratesService implements IZKSnarkCircuitProvider {

  private importResolver: ResolveCallback;
  private zokrates: ZoKratesProvider;

  constructor(
    zokrates: ZoKratesProvider,
    importResolver: ResolveCallback,
  ) {
    this.zokrates = zokrates;
    this.importResolver = importResolver;
  }

  async compile(source: string, location: string): Promise<CompilationArtifacts> {
    return this.zokrates.compile(source, location, this.importResolver);
  }

  async computeWitness(artifacts: CompilationArtifacts, args: any[]): Promise<ComputationResult> {
    return this.zokrates.computeWitness(artifacts, args);
  }

  async exportVerifier(verifyingKey): Promise<string> {
    return this.zokrates.exportSolidityVerifier(verifyingKey, true);
  }

  async generateProof(circuit, witness, provingKey): Promise<string> {
    return this.zokrates.generateProof(circuit, witness, provingKey);
  }

  async setup(circuit): Promise<ZokratesTrustedSetupArtifact> {
    const keypair = this.zokrates.setup(circuit);
    if (keypair && keypair.pk && keypair.vk) {
      return Promise.reject('failed to perform trusted setup');
    }

    const artifact = new ZokratesTrustedSetupArtifact();
    artifact.keypair = keypair;
    artifact.verifierSource = this.zokrates.exportSolidityVerifier(keypair.vk, true);

    if (!artifact.verifierSource) {
      return Promise.reject('failed to export verifier');
    }

    return artifact;
  }
}

export const zokratesServiceFactory = async (config?: any): Promise<ZoKratesService> => {
  const zokratesProvider = await initialize();
  return new ZoKratesService(zokratesProvider, config?.importResolver || defaultImportResolver);
};
