export const messageReservedBitsLength = 512; // reserved bits for future use

export enum Opcode {
  Baseline = 'BLINE',
}

export enum PayloadType {
  Binary = 0x0,
  Text = 0x1,
}

export type Message = {
  opcode: Opcode; // up to 40 bits
  recipient: string; // up to 336 bits
  shield: string; // up to 336 bits
  identifier: string; // 128 bits (i.e., uuidv4 circuit/workflow identifier)
  signature: string; // 64 bits
  type: PayloadType; // 1 bit
  payload: Buffer; // arbitrary length
}
