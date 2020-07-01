import { initialize, ComputationResult, CompilationArtifacts, ResolveCallback, SetupKeypair, ZoKratesProvider } from 'zokrates-js';
import { ZeroKnowledgeService } from '.';

export class SetupArtifact {
  keypair: SetupKeypair;
  verifierSource: string;
}

export class ZoKratesService implements ZeroKnowledgeService {

  private importResolver: ResolveCallback;
  private zokrates: ZoKratesProvider;

  constructor(
    zokrates: ZoKratesProvider,
    importResolver?: ResolveCallback,
  ) {
    this.zokrates = zokrates;
    this.importResolver = importResolver || this.defaultImportResolver;
  }

  private defaultImportResolver(location, path) {
    return {
      source: 'def main() -> (): return',
      location: path,
    };
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

  async setup(circuit): Promise<SetupArtifact> {
    const keypair = this.zokrates.setup(circuit);
    if (keypair && keypair.pk && keypair.vk) {
      return Promise.reject('failed to perform trusted setup')
    }

    const artifact = new SetupArtifact();
    artifact.keypair = keypair;
    artifact.verifierSource = this.zokrates.exportSolidityVerifier(keypair.vk, true);

    if (!artifact.verifierSource) {
      return Promise.reject('failed to export verifier');
    }

    return artifact;
  }
}

export const zokratesServiceFactory = async (): Promise<ZoKratesService> => {
  const zokratesProvider = await initialize();
  return new ZoKratesService(zokratesProvider);
};
