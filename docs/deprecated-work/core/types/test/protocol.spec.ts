import { Message, Opcode, PayloadType, marshalProtocolMessage, unmarshalProtocolMessage } from '../src/protocol';

describe('protocol message', () => {
  describe('marshaling', () => {
    let msg;

    beforeAll(async () => {
      msg = marshalProtocolMessage({
        opcode: Opcode.Baseline,
        sender: '0x96f1027fee06a15f42e48180705a2ecb2f846985',
        recipient: '0x512aA2447D05fe172cF59C1200FBa0EF7D271231',
        shield: '0x31B26EfC2B84ba8fE62b4f7A7F3D74606BAfD6D0',
        identifier: '123e4567-e89b-12d3-a456-426655440000',
        signature: '2f04ca19aa525862b827c55feec2f9a3743aaf6fa75f2d140733922cb05665f2',
        type: PayloadType.Text,
        payload: Buffer.from('{"hello": "world"}'),
      } as Message);
    });

    it('should marshal the message', () => {
      expect(msg.length).toBe(272+42);
    });
  });

  describe('unmarshaling', () => {
    let msg;

    beforeAll(async () => {
      msg = unmarshalProtocolMessage(Buffer.from('JOIN\x000x96f1027fee06a15f42e48180705a2ecb2f8469850xe9f441b9F1aFaf47c4A42D14330c887F619ee80D0xf2e246bb76df876cef8b38ae84130f4f55de395b08ee2cdb-e0ab-4d54-ab80-6a4796870f9a\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00743aaf6fa75f2d140733922cb05665f22f04ca19aa525862b827c55feec2f9a31{"address":"0x7Ecd41777BA491e67B42691145aFD4e2f1EF6089","authorized_bearer_token":"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYXRzIjp7InBlcm1pc3Npb25zIjp7InB1Ymxpc2giOnsiYWxsb3ciOlsiYmFzZWxpbmUuPiJdfSwic3Vic2NyaWJlIjp7ImFsbG93IjpbImJhc2VsaW5lLmluYm91bmQiXX19fSwiaWF0IjoxNTk4MjYyNDEyLCJleHAiOjE1OTgyNjc0MTIsImF1ZCI6Im5hdHM6Ly9sb2NhbGhvc3Q6NDIyMiIsImlzcyI6InRzLW5hdHN1dGlsIiwic3ViIjoiYmFzZWxpbmUuaW5ib3VuZCJ9.o2B7a8rGTXsCTBhiNhQWw5FUvQ0rlbyB9b7rtZD0ba8kbHBhziKuVbwBa4vt9-PvSMvyJ7gLcbzmJ1bSLtt89yA3pZTV5EwanhNvaRiYjQ0at-VsOwoxSeVfxRYNS1nzUOPoSTEcM9YGNmsJyKMSy8lqeSQnMMiTw7oPfz9Wi3E6ngX1nCpwoXnD_xNKSsiHF8G5XRwbehI97v1hgFXoq1-gW78b5u77n1Hz2C7c7IqgEyPw6wpot21N4vUi6TTi8-mwpSogCeTSge1brBSXKp3rdZTrEoVzfmr7msMH-vwR-D7ntUcTfDq1HB235PcaG3eh_PwbtTU84_QZwQJa2XM-XE-yaxnSF05Onu77BOHd_0AhG444oZLpGcytPbi0ghb5bSxITbHXSKGrrMetwNJcDnpM19JHCyoJ0zEpWQC45A7G3j_9JPY43Y9ub5fcLH5yml9KR03-2OKaL7etjGN0DEnF7tl9ho-iZDasu2TzyfnfGZmI2heNZwyRCG-KYPUNO4xjz8gR7jsVrG71mdlCJD1VLmCUwv46MN3Lb8SWu0jqL2ox6TtmyPwFhQZqZl57Rz9iZF85OzKcLHWERMdpG-lId3mDIRCB70RxM3nBwyh6a4V7TfSq4jMoC_pD-7yfFxkVbTsQVQbL4SfeJQ_C5decLyhfU8HmaC6wJXg"}'));
    });

    it('should parse the opcode', () => {
      expect(msg.opcode).toBe(Opcode.Join);
    });

    it('should parse the sender address', () => {
      expect(msg.sender).toBe('0x96f1027fee06a15f42e48180705a2ecb2f846985');
    });

    it('should parse the recipient address', () => {
      expect(msg.recipient).toBe('0xe9f441b9F1aFaf47c4A42D14330c887F619ee80D');
    });

    it('should parse the shield address', () => {
      expect(msg.shield).toBe('0xf2e246bb76df876cef8b38ae84130f4f55de395b');
    });

    it('should parse the workflow identifier', () => {
      expect(msg.identifier).toBe('08ee2cdb-e0ab-4d54-ab80-6a4796870f9a');
    });

    it('should parse the signature', () => {
      expect(msg.signature).toBe('743aaf6fa75f2d140733922cb05665f22f04ca19aa525862b827c55feec2f9a3');
    });

    it('should parse the payload type', () => {
      expect(msg.type).toBe(PayloadType.Text);
    });

    it('should parse the payload', () => {
      const payload = JSON.parse(msg.payload.toString());
      expect(payload.address).toBe('0x7Ecd41777BA491e67B42691145aFD4e2f1EF6089');
      expect(payload.authorized_bearer_token).toBe('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYXRzIjp7InBlcm1pc3Npb25zIjp7InB1Ymxpc2giOnsiYWxsb3ciOlsiYmFzZWxpbmUuPiJdfSwic3Vic2NyaWJlIjp7ImFsbG93IjpbImJhc2VsaW5lLmluYm91bmQiXX19fSwiaWF0IjoxNTk4MjYyNDEyLCJleHAiOjE1OTgyNjc0MTIsImF1ZCI6Im5hdHM6Ly9sb2NhbGhvc3Q6NDIyMiIsImlzcyI6InRzLW5hdHN1dGlsIiwic3ViIjoiYmFzZWxpbmUuaW5ib3VuZCJ9.o2B7a8rGTXsCTBhiNhQWw5FUvQ0rlbyB9b7rtZD0ba8kbHBhziKuVbwBa4vt9-PvSMvyJ7gLcbzmJ1bSLtt89yA3pZTV5EwanhNvaRiYjQ0at-VsOwoxSeVfxRYNS1nzUOPoSTEcM9YGNmsJyKMSy8lqeSQnMMiTw7oPfz9Wi3E6ngX1nCpwoXnD_xNKSsiHF8G5XRwbehI97v1hgFXoq1-gW78b5u77n1Hz2C7c7IqgEyPw6wpot21N4vUi6TTi8-mwpSogCeTSge1brBSXKp3rdZTrEoVzfmr7msMH-vwR-D7ntUcTfDq1HB235PcaG3eh_PwbtTU84_QZwQJa2XM-XE-yaxnSF05Onu77BOHd_0AhG444oZLpGcytPbi0ghb5bSxITbHXSKGrrMetwNJcDnpM19JHCyoJ0zEpWQC45A7G3j_9JPY43Y9ub5fcLH5yml9KR03-2OKaL7etjGN0DEnF7tl9ho-iZDasu2TzyfnfGZmI2heNZwyRCG-KYPUNO4xjz8gR7jsVrG71mdlCJD1VLmCUwv46MN3Lb8SWu0jqL2ox6TtmyPwFhQZqZl57Rz9iZF85OzKcLHWERMdpG-lId3mDIRCB70RxM3nBwyh6a4V7TfSq4jMoC_pD-7yfFxkVbTsQVQbL4SfeJQ_C5decLyhfU8HmaC6wJXg');
    });
  });
});
