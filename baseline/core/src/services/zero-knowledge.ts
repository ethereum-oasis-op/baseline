// TODO: flesh out params for all interface methods below...
export interface ZeroKnowledgeService {
  generateKeypair(params?: any): Promise<any>;
  generateSetups(params: any): Promise<any>;
  sign(payload: string): Promise<any>;
  broadcast(payload: string, opts: any): Promise<any>;
  executeCircuit(params: any): Promise<any>;
  validate(payload: string): Promise<any>;
  audit(params: any): Promise<any>;
}
