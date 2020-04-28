import { initialize, ComputationResult, CompilationArtifacts, ResolveCallback, SetupKeypair, ZoKratesProvider } from 'zokrates-js';
import { ZeroKnowledgeService } from '.';

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

  async setup(circuit): Promise<SetupKeypair> {
    return this.zokrates.setup(circuit);
  }
}

export const zokratesServiceFactory = async (): Promise<ZoKratesService> => {
  return initialize().then(zokratesProvider => new ZoKratesService(zokratesProvider));
};
