import solc from 'solc';
import { logger } from "../logger";

export const compileContract = async (contractName, contractSourceCode) => {
  logger.info('Received request to compile Solidity contract');
  let input = {
    language: 'Solidity',
    sources: {
      "test.sol": {
        content: contractSourceCode
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
  };
  
  logger.info('solc input:' + JSON.stringify(input, null, 4));
  let inputString = JSON.stringify(input)
  let output = await solc.compile(inputString);
  let outputJSON = await JSON.parse(output);
  let verifierBytecode = outputJSON.contracts["test.sol"][contractName].evm.bytecode.object

  logger.info('verifierBytecode:' + verifierBytecode)
  return "0x" + verifierBytecode
}
