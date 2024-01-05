import { CircuitInputsParserService } from './circuitInputParser.service';

let cips: CircuitInputsParserService;

beforeAll(async () => {
  cips = new CircuitInputsParserService();
});

describe('CircuitInputsParserService', () => {
  it('Should fail miserably', () => {
    // Arrange
    const payload = 'test';
    const schema = {} as CircuitInputsMapping;

    // Act
    const circuitInputs = cips.applyMappingToJSONPayload(payload, schema);

    // Assert
    expect(circuitInputs).toBe({});
  });
});
