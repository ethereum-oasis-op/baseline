export const messageReservedBitsLength = 512; // reserved bits for future use

export enum Opcode {
  Baseline = 'BLINE',
  Join = 'JOIN',
  Ping = 'PING',
  Pong = 'PONG',
}

export enum PayloadType {
  Binary = 0x0,
  Text = 0x1,
}

export type Message = {
  opcode: Opcode; // up to 40 bits
  recipient: string; // up to 336 bits
  shield: string; // up to 336 bits
  identifier: string; // up to 288 bits (i.e., UUIDv4 circuit/workflow identifier)
  signature: string; // 512 bits
  type: PayloadType; // 1 bit
  payload: Buffer; // arbitrary length
}
