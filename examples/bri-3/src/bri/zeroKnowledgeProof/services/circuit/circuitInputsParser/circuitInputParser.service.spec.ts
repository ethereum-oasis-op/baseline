import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { LoggingService } from '../../../../../shared/logging/logging.service';
import { CircuitInputsParserService } from './circuitInputParser.service';

let cips: CircuitInputsParserService;
const loggingServiceMock: DeepMockProxy<LoggingService> =
  mockDeep<LoggingService>();

beforeAll(async () => {
  cips = new CircuitInputsParserService(loggingServiceMock);
});

describe('validateCircuitInputTranslationSchema', () => {
  it('Should return "Missing mapping array" if mapping array is missing', () => {
    // Arrange
    const schema = '{}';

    // Act
    const result = cips.validateCircuitInputTranslationSchema(schema);

    // Assert
    expect(result).toEqual('Missing mapping array');
  });

  it('Should return "{circuitInput}" if any required property has incorrect type', () => {
    // Arrange
    const schema =
      '{"mapping": [{"circuitInput": 123, "description": "desc1", "payloadJsonPath": "path1", "dataType": "string"}]}';

    // Act
    const result = cips.validateCircuitInputTranslationSchema(schema);

    // Assert
    expect(result).toEqual('123 not of type string');
  });

  it('Should return "{description}" if any required property has incorrect type', () => {
    // Arrange
    const schema =
      '{"mapping": [{"circuitInput": "123", "description": false, "payloadJsonPath": "path1", "dataType": "string"}]}';

    // Act
    const result = cips.validateCircuitInputTranslationSchema(schema);

    // Assert
    expect(result).toEqual('false not of type string');
  });

  it('Should return "{payloadJsonPath}" if any required property has incorrect type', () => {
    // Arrange
    const schema =
      '{"mapping": [{"circuitInput": "123", "description": "desc", "payloadJsonPath": 12, "dataType": "string"}]}';

    // Act
    const result = cips.validateCircuitInputTranslationSchema(schema);

    // Assert
    expect(result).toEqual('12 not of type string');
  });

  it('Should return "{dataType}" if any required property has incorrect type', () => {
    // Arrange
    const schema =
      '{"mapping": [{"circuitInput": "123", "description": "desc", "payloadJsonPath": "path1", "dataType": 232}]}';

    // Act
    const result = cips.validateCircuitInputTranslationSchema(schema);

    // Assert
    expect(result).toEqual('232 not of type string');
  });

  it('Should return "arrayType not defined properly for {circuitInput}" if dataType is array and arrayType is not defined properly', () => {
    // Arrange
    const schema =
      '{"mapping": [{"circuitInput": "input1", "description": "desc1", "payloadJsonPath": "path1", "dataType": "array", "arrayType": 123}]}';

    // Act
    const result = cips.validateCircuitInputTranslationSchema(schema);

    // Assert
    expect(result).toEqual('arrayType not defined properly for input1');
  });

  it('Should return "defaultValue not of type {dataType} for {circuitInput}" if defaultValue type does not match dataType', () => {
    // Arrange
    const schema =
      '{"mapping": [{"circuitInput": "input1", "description": "desc1", "payloadJsonPath": "path1", "dataType": "string", "defaultValue": 123}]}';

    // Act
    const result = cips.validateCircuitInputTranslationSchema(schema);

    // Assert
    expect(result).toEqual('defaultValue not of type string for input1');
  });

  it('Should return error if an error occurs during schema parsing', () => {
    // Arrange
    const schema = 'invalid JSON';

    // Act
    const result = cips.validateCircuitInputTranslationSchema(schema);

    // Assert
    expect(result).toMatch(/^Unexpected token/);
  });

  it('Should return "" if basic valid schema passed in', () => {
    // Arrange
    const schema =
      '{"mapping": [{"circuitInput": "input1", "description": "desc1", "payloadJsonPath": "path1", "dataType": "string"}]}';

    // Act
    const result = cips.validateCircuitInputTranslationSchema(schema);

    // Assert
    expect(result).toEqual('');
  });

  it('Should return "" if valid schema with default value passed in', () => {
    // Arrange
    const schema =
      '{"mapping": [{"circuitInput": "input1", "description": "desc1", "payloadJsonPath": "path1", "dataType": "string", "defaultValue": "123"}]}';

    // Act
    const result = cips.validateCircuitInputTranslationSchema(schema);

    // Assert
    expect(result).toEqual('');
  });

  it('Should return "" if valid schema with arrayType in', () => {
    // Arrange
    const schema =
      '{"mapping": [{"circuitInput": "input1", "description": "desc1", "payloadJsonPath": "path1", "dataType": "array", "arrayType": "string"}]}';

    // Act
    const result = cips.validateCircuitInputTranslationSchema(schema);

    // Assert
    expect(result).toEqual('');
  });
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
    const payload = `{
        "supplierInvoiceID": "INV123"
       }`;

    const schema = {
      mapping: [
        {
          circuitInput: 'dascircuitinput',
          description: 'desc',
          payloadJsonPath: 'supplierInvoiceID',
          dataType: 'string',
        } as CircuitInputMapping,
      ],
    } as CircuitInputsMapping;

    // Act
    const circuitInputs = cips.applyMappingToJSONPayload(payload, schema);

    // Assert
    expect(circuitInputs).toStrictEqual({ dascircuitinput: 387 });
  });

  it('Should generate a single circuit input param with charcode sum based on a default value for a missing string param at root level', () => {
    // Arrange
    const payload = `{
        "somethingElse": ""
       }`;

    const defaultParamValue = '555333';

    const schema = {
      mapping: [
        {
          circuitInput: 'dascircuitinput',
          description: 'desc',
          payloadJsonPath: 'supplierInvoiceID',
          dataType: 'string',
          defaultValue: defaultParamValue,
        } as CircuitInputMapping,
      ],
    } as CircuitInputsMapping;

    // Act
    const circuitInputs = cips.applyMappingToJSONPayload(payload, schema);

    // Assert
    expect(circuitInputs).toStrictEqual({ dascircuitinput: 312 });
  });

  it('Should return null based on a missing default value for a missing string param at root level', () => {
    // Arrange
    const payload = `{
        "somethingElse": ""
       }`;

    const schema = {
      mapping: [
        {
          circuitInput: 'dascircuitinput',
          description: 'desc',
          payloadJsonPath: 'supplierInvoiceID',
          dataType: 'string',
        } as CircuitInputMapping,
      ],
    } as CircuitInputsMapping;

    // Act
    const circuitInputs = cips.applyMappingToJSONPayload(payload, schema);

    // Assert
    expect(circuitInputs).toBeNull();
  });

  it('Should generate a single circuit input param with charcode sum based on a single string param at root + 1 level', () => {
    // Arrange
    const payload = `{
        "supplierInvoice": {
          "ID": "INV123"
        } 
       }`;

    const schema = {
      mapping: [
        {
          circuitInput: 'dascircuitinput',
          description: 'desc',
          payloadJsonPath: 'supplierInvoice.ID',
          dataType: 'string',
        } as CircuitInputMapping,
      ],
    } as CircuitInputsMapping;

    // Act
    const circuitInputs = cips.applyMappingToJSONPayload(payload, schema);

    // Assert
    expect(circuitInputs).toStrictEqual({ dascircuitinput: 387 });
  });

  it('Should generate a single circuit input param based on a single integer param at root level', () => {
    // Arrange
    const payload = `{
        "supplierInvoiceID": 123
       }`;

    const schema = {
      mapping: [
        {
          circuitInput: 'dascircuitinput',
          description: 'desc',
          payloadJsonPath: 'supplierInvoiceID',
          dataType: 'integer',
        } as CircuitInputMapping,
      ],
    } as CircuitInputsMapping;

    // Act
    const circuitInputs = cips.applyMappingToJSONPayload(payload, schema);

    // Assert
    expect(circuitInputs).toStrictEqual({ dascircuitinput: 123 });
  });

  it('Should generate a single circuit input param based on a default value for a missing integer param at root level', () => {
    // Arrange
    const payload = `{
        "somethingElse": ""
       }`;

    const defaultValue = 555333;

    const schema = {
      mapping: [
        {
          circuitInput: 'dascircuitinput',
          description: 'desc',
          payloadJsonPath: 'supplierInvoiceID',
          dataType: 'integer',
          defaultValue: defaultValue,
        } as CircuitInputMapping,
      ],
    } as CircuitInputsMapping;

    // Act
    const circuitInputs = cips.applyMappingToJSONPayload(payload, schema);

    // Assert
    expect(circuitInputs).toStrictEqual({ dascircuitinput: defaultValue });
  });

  it('Should return null based on a missing default value for a missing integer param at root level', () => {
    // Arrange
    const payload = `{
        "somethingElse": ""
       }`;

    const schema = {
      mapping: [
        {
          circuitInput: 'dascircuitinput',
          description: 'desc',
          payloadJsonPath: 'supplierInvoiceID',
          dataType: 'integer',
        } as CircuitInputMapping,
      ],
    } as CircuitInputsMapping;

    // Act
    const circuitInputs = cips.applyMappingToJSONPayload(payload, schema);

    // Assert
    expect(circuitInputs).toBeNull();
  });

  it('Should generate a single circuit input param based on a single integer array param at root level', () => {
    // Arrange
    const payload = `{
        "supplierInvoiceIDs": [
          123,
          321,
          454
        ]
       }`;

    const schema = {
      mapping: [
        {
          circuitInput: 'dascircuitinput',
          description: 'desc',
          payloadJsonPath: 'supplierInvoiceIDs',
          dataType: 'array',
          arrayType: 'integer',
        } as CircuitInputMapping,
      ],
    } as CircuitInputsMapping;

    // Act
    const circuitInputs = cips.applyMappingToJSONPayload(payload, schema);

    // Assert
    expect(circuitInputs).toStrictEqual({ dascircuitinput: [123, 321, 454] });
  });

  it('Should generate a single circuit input param with charcode sums based on a single string array param at root level', () => {
    // Arrange
    const payload = `{
        "supplierInvoiceIDs": [
          "INV123",
          "INV124",
          "INV125"
        ]
       }`;

    const schema = {
      mapping: [
        {
          circuitInput: 'dascircuitinput',
          description: 'desc',
          payloadJsonPath: 'supplierInvoiceIDs',
          dataType: 'array',
          arrayType: 'string',
        } as CircuitInputMapping,
      ],
    } as CircuitInputsMapping;

    // Act
    const circuitInputs = cips.applyMappingToJSONPayload(payload, schema);

    // Assert
    expect(circuitInputs).toStrictEqual({ dascircuitinput: [387, 388, 389] });
  });

  it('Should generate a single circuit input param based on a object string property of an object array at root level', () => {
    // Arrange
    const payload = `{
        "supplierInvoiceIDs": [
          { "id": "INV123", "price" : 222 },
          { "id": "INV124", "price" : 223 },
          { "id": "INV125", "price" : 224 }
        ]
       }`;

    const schema = {
      mapping: [
        {
          circuitInput: 'dascircuitinput',
          description: 'desc',
          payloadJsonPath: 'supplierInvoiceIDs',
          dataType: 'array',
          arrayType: 'object',
          arrayItemFieldName: 'id',
          arrayItemFieldType: 'string',
        } as CircuitInputMapping,
      ],
    } as CircuitInputsMapping;

    // Act
    const circuitInputs = cips.applyMappingToJSONPayload(payload, schema);

    // Assert
    expect(circuitInputs).toStrictEqual({ dascircuitinput: [387, 388, 389] });
  });

  it('Should generate a single circuit input param based on a object integer property of an object array at root level', () => {
    // Arrange
    const payload = `{
        "supplierInvoiceIDs": [
          { "id": "1", "price" : 222 },
          { "id": "2", "price" : 223 },
          { "id": "3", "price" : 224 }
        ]
       }`;

    const schema = {
      mapping: [
        {
          circuitInput: 'dascircuitinput',
          description: 'desc',
          payloadJsonPath: 'supplierInvoiceIDs',
          dataType: 'array',
          arrayType: 'object',
          arrayItemFieldName: 'price',
          arrayItemFieldType: 'integer',
        } as CircuitInputMapping,
      ],
    } as CircuitInputsMapping;

    // Act
    const circuitInputs = cips.applyMappingToJSONPayload(payload, schema);

    // Assert
    expect(circuitInputs).toStrictEqual({ dascircuitinput: [222, 223, 224] });
  });
});
