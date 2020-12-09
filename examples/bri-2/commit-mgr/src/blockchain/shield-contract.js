export const shieldContract = {
  "abi": [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_verifier",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_treeHeight",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "leafIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "leafValue",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "root",
          "type": "bytes32"
        }
      ],
      "name": "NewLeaf",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "minLeafIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bytes32[]",
          "name": "leafValues",
          "type": "bytes32[]"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "root",
          "type": "bytes32"
        }
      ],
      "name": "NewLeaves",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bytes27",
          "name": "leftInput",
          "type": "bytes27"
        },
        {
          "indexed": false,
          "internalType": "bytes27",
          "name": "rightInput",
          "type": "bytes27"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "output",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "nodeIndex",
          "type": "uint256"
        }
      ],
      "name": "Output",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "frontier",
      "outputs": [
        {
          "internalType": "bytes27",
          "name": "",
          "type": "bytes27"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "latestRoot",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "leafCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "treeHeight",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "treeWidth",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "zero",
      "outputs": [
        {
          "internalType": "bytes27",
          "name": "",
          "type": "bytes27"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getVerifier",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256[]",
          "name": "_proof",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_publicInputs",
          "type": "uint256[]"
        },
        {
          "internalType": "bytes32",
          "name": "_newCommitment",
          "type": "bytes32"
        }
      ],
      "name": "verifyAndPush",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
}
