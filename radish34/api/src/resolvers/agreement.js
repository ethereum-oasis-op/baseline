import { generateCommitment } from '../services/agreement';
import { strip0x } from '../utils/crypto/conversions';

export default {
    Query: {
      agreement: async (_parent, args) => {
        const out = simpleGetter();
        return {
            _id: "1234",
            zkpPublicKeyOfBuyer: "2345",
            zkpPublicKeyOfSupplier: "ABCD",
            name: "agreement",
            description: "random",
            erc20ContractAddress: "0x123",
            commitments: [{
                commitment: "ASD",
                index: 256,
                salt: "salt",
                nullifier: "nullifier",
                variables: {
                    accumulatedVolumeOrdered: 0,
                    accumulatedVolumeDelivered: 0
                }
            }],
            whisperPublicKeySupplier: "3456",
            buyerSignatureStatus: true,
            supplierSignatureStatus: true,
            supplierDetails: {
                address: "0xb794f5ea0ba39494ce839613fffba74279579268",
                zkpPublicKey: "0x234",
                identity: "ID",
                name: "supplier",
                role: 2
            },
            linkedId: "RFP"
          }
      }
    },
    Mutation: {
      createAgreement: async (_parent, args, context) => {
        console.log('\n\n\nRequest to create Agreement with inputs:');
        console.log(args.input);
        return args.input;
      },
      generateCommitment: async(_parent, args, context) => {
        let data = {}
        data.initType = args.input.initType;
        data.constants = args.input.constants;
        data.commitment = args.input.commitment;
        let commitmentOut = await generateCommitment(data);
        return {
          commitment: commitmentOut.commitment._hex.toString(),
          nullifier: commitmentOut.commitment._hex.toString()
        }
      }
    },
  };
  