type CircuitInputsMapping = {
  mapping: CircuitInputMapping[];
};

type CircuitInputMapping = {
  circuitInput: string;
  description: string;
  payloadJsonPath: string;
  dataType: string;
  defaultValue?: any;
  arrayType?: string;
};
