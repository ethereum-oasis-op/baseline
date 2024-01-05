import { CircuitInputsParserService } from './circuitInputParser.service';

let cips: CircuitInputsParserService;

beforeAll(async () => {
  cips = new CircuitInputsParserService();
});

describe('CircuitInputsParserService', () => {
  it('Should return null if empty CircuitInputsMapping passed in', () => {
    // Arrange
    const payload = 'test';
    const schema = {} as CircuitInputsMapping;

    // Act
    const circuitInputs = cips.applyMappingToJSONPayload(payload, schema);

    // Assert
    expect(circuitInputs).toBeNull();
  });

  it('Should generate a single circuit input param based on a single string param at root level', () => {
    // Arrange
    const payload = 
      `{
        "supplierInvoiceID": "INV123"
       }`;
    const schema = {
      mapping: [{
        circuitInput: 'dascircuitinput',
        description: 'desc',
        payloadJsonPath: 'supplierInvoiceID',
        dataType: 'string',
      } as CircuitInputMapping]
    } as CircuitInputsMapping;

    // Act
    const circuitInputs = cips.applyMappingToJSONPayload(payload, schema);

    // Assert
    expect(circuitInputs).toStrictEqual({ "dascircuitinput": "INV123" });
  });

  it('Should generate a single circuit input param based on a default value for a missing string param at root level', () => {
    // Arrange
    const payload = 
      `{
        "somethingElse": ""
       }`;
    const schema = {
      mapping: [{
        circuitInput: 'dascircuitinput',
        description: 'desc',
        payloadJsonPath: 'supplierInvoiceID',
        dataType: 'string',
        defaultValue: '555333'
      } as CircuitInputMapping]
    } as CircuitInputsMapping;

    // Act
    const circuitInputs = cips.applyMappingToJSONPayload(payload, schema);

    // Assert
    expect(circuitInputs).toStrictEqual({ "dascircuitinput": "555333" });
  });

  it('Should return null based on a missing default value for a missing string param at root level', () => {
    // Arrange
    const payload = 
      `{
        "somethingElse": ""
       }`;
    const schema = {
      mapping: [{
        circuitInput: 'dascircuitinput',
        description: 'desc',
        payloadJsonPath: 'supplierInvoiceID',
        dataType: 'string',
      } as CircuitInputMapping]
    } as CircuitInputsMapping;

    // Act
    const circuitInputs = cips.applyMappingToJSONPayload(payload, schema);

    // Assert
    expect(circuitInputs).toBeNull();
  });
});