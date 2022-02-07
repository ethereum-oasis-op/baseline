export interface ProtocolMessage {
  baselineID: string;
  id: string;
  type: string;
  payload: {
    id: string;
    data: {};
  };
}
