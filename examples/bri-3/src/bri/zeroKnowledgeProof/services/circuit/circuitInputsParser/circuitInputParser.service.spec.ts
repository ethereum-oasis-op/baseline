import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { LoggingService } from '../../../../../shared/logging/logging.service';
import { CircuitInputsParserService } from './circuitInputParser.service';

let cips: CircuitInputsParserService;
const loggingServiceMock: DeepMockProxy<LoggingService> =  mockDeep<LoggingService>();

beforeAll(async () => {
  cips = new CircuitInputsParserService(loggingServiceMock);
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

  it('Should generate a single circuit input param with charcode sum based on a single string param at root level', () => {
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
    expect(circuitInputs).toStrictEqual({ "dascircuitinput": 387 });
  });

  it('Should generate a single circuit input param with charcode sum based on a default value for a missing string param at root level', () => {
    // Arrange
    const payload = 
      `{
        "somethingElse": ""
       }`;

    const defaultParamValue = '555333';

    const schema = {
      mapping: [{
        circuitInput: 'dascircuitinput',
        description: 'desc',
        payloadJsonPath: 'supplierInvoiceID',
        dataType: 'string',
        defaultValue: defaultParamValue
      } as CircuitInputMapping]
    } as CircuitInputsMapping;

    // Act
    const circuitInputs = cips.applyMappingToJSONPayload(payload, schema);

    // Assert
    expect(circuitInputs).toStrictEqual({ "dascircuitinput": 312 });
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

  it('Should generate a single circuit input param with charcode sum based on a single string param at root + 1 level', () => {
    // Arrange
    const payload = 
      `{
        "supplierInvoice": {
          "ID": "INV123"
        } 
       }`;

    const schema = {
      mapping: [{
        circuitInput: 'dascircuitinput',
        description: 'desc',
        payloadJsonPath: 'supplierInvoice.ID',
        dataType: 'string',
      } as CircuitInputMapping]
    } as CircuitInputsMapping;

    // Act
    const circuitInputs = cips.applyMappingToJSONPayload(payload, schema);

    // Assert
    expect(circuitInputs).toStrictEqual({ "dascircuitinput": 387 });
  });

  it('Should generate a single circuit input param based on a single integer param at root level', () => {
    // Arrange
    const payload = 
      `{
        "supplierInvoiceID": 123
       }`;

    const schema = {
      mapping: [{
        circuitInput: 'dascircuitinput',
        description: 'desc',
        payloadJsonPath: 'supplierInvoiceID',
        dataType: 'integer',
      } as CircuitInputMapping]
    } as CircuitInputsMapping;

    // Act
    const circuitInputs = cips.applyMappingToJSONPayload(payload, schema);

    // Assert
    expect(circuitInputs).toStrictEqual({ "dascircuitinput": 123 });
  });

  it('Should generate a single circuit input param based on a default value for a missing integer param at root level', () => {
    // Arrange
    const payload = 
      `{
        "somethingElse": ""
       }`;

    const defaultValue = 555333;

    const schema = {
      mapping: [{
        circuitInput: 'dascircuitinput',
        description: 'desc',
        payloadJsonPath: 'supplierInvoiceID',
        dataType: 'integer',
        defaultValue: defaultValue
      } as CircuitInputMapping]
    } as CircuitInputsMapping;

    // Act
    const circuitInputs = cips.applyMappingToJSONPayload(payload, schema);

    // Assert
    expect(circuitInputs).toStrictEqual({ "dascircuitinput": defaultValue });
  });

  it('Should return null based on a missing default value for a missing integer param at root level', () => {
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
        dataType: 'integer',
      } as CircuitInputMapping]
    } as CircuitInputsMapping;

    // Act
    const circuitInputs = cips.applyMappingToJSONPayload(payload, schema);

    // Assert
    expect(circuitInputs).toBeNull();
  });

  it('Should generate a single circuit input param based on a single integer array param at root level', () => {
    // Arrange
    const payload = 
      `{
        "supplierInvoiceIDs": [
          123,
          321,
          454
        ]
       }`;

    const schema = {
      mapping: [{
        circuitInput: 'dascircuitinput',
        description: 'desc',
        payloadJsonPath: 'supplierInvoiceIDs',
        dataType: 'array',
        arrayType: 'integer',
      } as CircuitInputMapping]
    } as CircuitInputsMapping;

    // Act
    const circuitInputs = cips.applyMappingToJSONPayload(payload, schema);

    // Assert
    expect(circuitInputs).toStrictEqual({ "dascircuitinput": [123, 321, 454] });
  });

  it('Should generate a single circuit input param with charcode sums based on a single string array param at root level', () => {
    // Arrange
    const payload = 
      `{
        "supplierInvoiceIDs": [
          "INV123",
          "INV124",
          "INV125"
        ]
       }`;

    const schema = {
      mapping: [{
        circuitInput: 'dascircuitinput',
        description: 'desc',
        payloadJsonPath: 'supplierInvoiceIDs',
        dataType: 'array',
        arrayType: 'string',
      } as CircuitInputMapping]
    } as CircuitInputsMapping;

    // Act
    const circuitInputs = cips.applyMappingToJSONPayload(payload, schema);

    // Assert
    expect(circuitInputs).toStrictEqual({ "dascircuitinput": [387, 388, 389] });
  });
});
