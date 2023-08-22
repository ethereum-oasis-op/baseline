import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { NOT_FOUND_ERR_MESSAGE } from '../api/err.messages';
import { BpiAccount } from '../models/bpiAccount';
import { MerkleTreeService } from 'src/bri/merkleTree/services/merkleTree.service';
// import { withBark } from 'prisma-extension-bark'

// Repositories are the only places that talk the Prisma language of models.
// They are always mapped to and from domain objects so that the business layer of the application
// does not have to care about the ORM.
@Injectable()
export class BpiAccountStorageAgent extends PrismaService {
  private barkPrismaClient;
  constructor(@InjectMapper() private readonly mapper: Mapper,private readonly merkleTreeService: MerkleTreeService) {
    super();
    // this.barkPrismaClient  = this.$extends(withBark({ modelNames: ['stateTreeNode'] }))
  }

  async getAccountById(id: string): Promise<BpiAccount> {
    const bpiAccountModel = await this.bpiAccount.findUnique({
      where: { id },
      include: {
        ownerBpiSubjectAccounts: {
          include: {
            creatorBpiSubject: true,
            ownerBpiSubject: true,
          },
        },
      },
    });

    if (!bpiAccountModel) {
      throw new NotFoundException(NOT_FOUND_ERR_MESSAGE);
    }

    return this.mapper.map(bpiAccountModel, BpiAccount, BpiAccount);
  }

  async getAllBpiAccounts(): Promise<BpiAccount[]> {
    const bpiAccountModels = await this.bpiAccount.findMany({
      include: {
        ownerBpiSubjectAccounts: {
          include: {
            creatorBpiSubject: true,
            ownerBpiSubject: true,
          },
        },
      },
    });

    return bpiAccountModels.map((bp) => {
      return this.mapper.map(bp, BpiAccount, BpiAccount);
    });
  }

  async storeNewBpiAccount(bpiAccount: BpiAccount): Promise<BpiAccount> {
    const connectedOwnerBpiAccounts = bpiAccount.ownerBpiSubjectAccounts.map(
      (o) => {
        return {
          id: o.id,
        };
      },
    );
    const newBpiAccountModel = await this.bpiAccount.create({
      data: {
        nonce: bpiAccount.nonce,
        ownerBpiSubjectAccounts: {
          connect: connectedOwnerBpiAccounts,
        },
        authorizationCondition: bpiAccount.authorizationCondition,
        stateObjectProverSystem: bpiAccount.stateObjectProverSystem,
      },
    });

    return this.mapper.map(newBpiAccountModel, BpiAccount, BpiAccount);
  }

  async updateBpiAccount(bpiAccount: BpiAccount): Promise<BpiAccount> {
    const newBpiAccountModel = await this.bpiAccount.update({
      where: { id: bpiAccount.id },
      data: {
        nonce: bpiAccount.nonce,
      },
    });

    return this.mapper.map(newBpiAccountModel, BpiAccount, BpiAccount);
  }

  async deleteBpiAccount(bpiAccount: BpiAccount): Promise<void> {
    await this.bpiAccount.delete({
      where: { id: bpiAccount.id },
    });
  }

  async addNewLeafToStateTree(id: string, leafValue: string): Promise<boolean>  {
    const bpiAccountModel = await this.bpiAccount.findUnique({
      where: { id },
      include: {
        ownerBpiSubjectAccounts: {
          include: {
            creatorBpiSubject: true,
            ownerBpiSubject: true,
          },
        },
        stateTreeNodes: true
      },
    });

    if (!bpiAccountModel) {
      return false;
    }

    // Reconstruct a MerkeTree from the bpiAccountModel.StateTreeNodes
    // TODO: Only leaves should be provided here
    const bpiAccountStateTree = this.merkleTreeService.formMerkleTree(bpiAccountModel?.stateTreeNodes.map(stn => stn.value), 'sha256' );
    
    // add the new leaf to the MerkleTree
    const hashFn = this.merkleTreeService.createHashFunction('sha256');
    bpiAccountStateTree.addLeaf(hashFn(leafValue));

    // TODO: Translate the new MerkleTree to StateTreeNodes and update BpiAccount
    
  }
}


// console.log
// {
//   "options": {
//     "complete": false,
//     "isBitcoinTree": false,
//     "hashLeaves": false,
//     "sortLeaves": false,
//     "sortPairs": false,
//     "sort": false,
//     "fillDefaultHash": null,
//     "duplicateOdd": false
//   },
//   "root": "0xb367dc579cca262bafded91f5d2a25b90adf3044e7d421b2265d4104e3cfc5df",
//   "layers": [
//     [
//       "0xf2453aa9ceb6fe7bdfb31872d7fcf1ddd22abf72d207e1df1b259baf1d37c99c",
//       "0x6d6281e25fdc802d54dbfe0c78ae6a4b34663fda98f47f40d0f2de65a0c43b3d",
//       "0x49e96d7cdf58069cc793555324e2226642f2f7f8bfff4cebe0c11a61eecef60a",
//       "0x983bd614bb5afece5ab3b6023f71147cd7b6bc2314f9d27af7422541c6558389",
//       "0x9e9bfdb34650e38bc1619a7666d06e3b006d11e8db46c3d602812b7947ef15d4",
//       "0x85e8ea577b580b35c9497704500443a867e8ad095977eda2d3a22a5f24a2d6b0",
//       "0xb6cf0ef44980c5e44706bb8234c8fe3ad85467fcb86cd68ac43df5a15cdc8402",
//       "0x19f8e7d3ff783f21591f259d22556018352eb9f82fc0bbd312798ff27314b2a7",
//       "0x920e413c7d411b61ef3e8c63b1cb6ad058d5f95f8b481dbafe60248387d8c355",
//       "0xa253ff09c5a8678e1fd1962b2c329245e139e45f9cc6ced4e5d7ad42c4108fc0",
//       "0xa56145270ce6b3bebd1dd012b73948677dd618d496488bc608a3cb43ce3547dd",
//       "0x6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b",
//       "0x83c996618b8eac2ea1ea4a1deac6e5eb04258e4b2a66dd3f98e9add957e50b91",
//       "0xdfc3ec2142bb9ca648a80ec1b8c82abcdb2f737f4973555f72e6d7986e125504",
//       "0x683b531f41ec88a2f345b727afe59757b73162a340a65c86bba62866f8fe556c",
//       "0xad57366865126e55649ecb23ae1d48887544976efea46a48eb5d85a6eeb4d306",
//       "0xcf38d95c9c6b1d9d5125c04d41a54df57727ef4cfb3f5116a602fe2b25115c13",
//       "0x6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b",
//       "0xa56145270ce6b3bebd1dd012b73948677dd618d496488bc608a3cb43ce3547dd",
//       "0xd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35",
//       "0x83c996618b8eac2ea1ea4a1deac6e5eb04258e4b2a66dd3f98e9add957e50b91",
//       "0xe39cc9b8ce8c9d3a239bc8042cdf870acda5ffe3ba0c850e5ad78ae2d4c9c82e",
//       "0x683b531f41ec88a2f345b727afe59757b73162a340a65c86bba62866f8fe556c",
//       "0x27badc983df1780b60c2b3fa9d3a19a00e46aac798451f0febdca52920faaddf",
//       "0xcf38d95c9c6b1d9d5125c04d41a54df57727ef4cfb3f5116a602fe2b25115c13",
//       "0x6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b"
//     ],
//     [
//       "0x2cfd130967d3706df10eb6b62773d3fb53cde7cf2c2b0983b9372fc73e3f2a76",
//       "0x6b765a9b951fd00e60e3c180c87a56fb0be52c9714c2fab80c001bfb8e64b5a9",
//       "0xada63224290f2f4c4b3a9286a24d0e5913962d1fcb6a56cc28d24dfc0781b473",
//       "0xd4203f26d3a7bcab9577bb5e91ae7109d367cb88203c2c9f0a00b98650c57c8d",
//       "0x6bab750ba86745b83065c22cf1b24f878d7f9df1f91ea946720f33263f923fd6",
//       "0xe25652bff270e58bce70c4fc76ea3a2668c05fc916ddba29fdf71b0d9ae3e0d1",
//       "0x24a2c359f98fdb29c58b6eefad1d36a46e372c180bde00f378734103b8693efc",
//       "0x377db95f5ff17a7444060e1dc8671f68f7a1ff1da52a3ff46bf84c678a6aa3fc",
//       "0x8e0446a7ca5426fa397679b09dd7b7fa60107f3a6f2120d003c254a9d86e2d3a",
//       "0x4d35bbc6a4d2317872bbd44e8faa8136470aea04eee361252b7aa1a9e21ff14e",
//       "0x0e93aceb55156848377b5be32ad42dffbfbebfd39636fcf3c017fc6ed5514a1d",
//       "0x4f361397eeb2db5f63ff596fea9879f70da1e76cf99737e8deaf51aeed1a65e7",
//       "0x8e0446a7ca5426fa397679b09dd7b7fa60107f3a6f2120d003c254a9d86e2d3a"
//     ],
//     [
//       "0x546b84ca97305a4ee331fa4d8be2afe317b54c5000d4b661105f40407ecf05d4",
//       "0xfca4f53fc3067bc162d7c41fe68b89b6659239c2ffa69c7e0322801a85c2cbf0",
//       "0x47f9352af8d76885bbd20d0f577e361cf62c9c07a4c821bf09c926b24b8e4d8b",
//       "0xdec4633b40edc5e1f802b8cc49f37a97362130c2899ce9a5cad8f56202ba4f0d",
//       "0x204b6557df98739beaa1f4fdd23416b76976a04b7cfff8e4a81d4f2506a9eae0",
//       "0x16c16c044dd8c84f463315babec633f417adbf429b857e7769b876427b80080d",
//       "0x8e0446a7ca5426fa397679b09dd7b7fa60107f3a6f2120d003c254a9d86e2d3a"
//     ],
//     [
//       "0x97921c2679a8a5b639081cb989f538590153e6e82249f5141f4ac07b3ac58de6",
//       "0x8b50e54bc0e9a7efe6455855e5f760638d1cf308351611a75b13bdff633780cd",
//       "0xfbb8348d6759ef35cf15fac19d52559679af0561f4aea5a51329ebd569d369e6",
//       "0x8e0446a7ca5426fa397679b09dd7b7fa60107f3a6f2120d003c254a9d86e2d3a"
//     ],
//     [
//       "0x83df2459d865038e159d787adfd57b87a493487f20e110604ca4cc9300ee01e0",
//       "0x2195d5ce5e9fd41ee9d04f1dd40ca41684b2d6a10cbba18c5cb7bb29cbaf5912"
//     ],
//     [
//       "0xb367dc579cca262bafded91f5d2a25b90adf3044e7d421b2265d4104e3cfc5df"
//     ]
//   ],
//   "leaves": [
//     "0xf2453aa9ceb6fe7bdfb31872d7fcf1ddd22abf72d207e1df1b259baf1d37c99c",
//     "0x6d6281e25fdc802d54dbfe0c78ae6a4b34663fda98f47f40d0f2de65a0c43b3d",
//     "0x49e96d7cdf58069cc793555324e2226642f2f7f8bfff4cebe0c11a61eecef60a",
//     "0x983bd614bb5afece5ab3b6023f71147cd7b6bc2314f9d27af7422541c6558389",
//     "0x9e9bfdb34650e38bc1619a7666d06e3b006d11e8db46c3d602812b7947ef15d4",
//     "0x85e8ea577b580b35c9497704500443a867e8ad095977eda2d3a22a5f24a2d6b0",
//     "0xb6cf0ef44980c5e44706bb8234c8fe3ad85467fcb86cd68ac43df5a15cdc8402",
//     "0x19f8e7d3ff783f21591f259d22556018352eb9f82fc0bbd312798ff27314b2a7",
//     "0x920e413c7d411b61ef3e8c63b1cb6ad058d5f95f8b481dbafe60248387d8c355",
//     "0xa253ff09c5a8678e1fd1962b2c329245e139e45f9cc6ced4e5d7ad42c4108fc0",
//     "0xa56145270ce6b3bebd1dd012b73948677dd618d496488bc608a3cb43ce3547dd",
//     "0x6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b",
//     "0x83c996618b8eac2ea1ea4a1deac6e5eb04258e4b2a66dd3f98e9add957e50b91",
//     "0xdfc3ec2142bb9ca648a80ec1b8c82abcdb2f737f4973555f72e6d7986e125504",
//     "0x683b531f41ec88a2f345b727afe59757b73162a340a65c86bba62866f8fe556c",
//     "0xad57366865126e55649ecb23ae1d48887544976efea46a48eb5d85a6eeb4d306",
//     "0xcf38d95c9c6b1d9d5125c04d41a54df57727ef4cfb3f5116a602fe2b25115c13",
//     "0x6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b",
//     "0xa56145270ce6b3bebd1dd012b73948677dd618d496488bc608a3cb43ce3547dd",
//     "0xd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35",
//     "0x83c996618b8eac2ea1ea4a1deac6e5eb04258e4b2a66dd3f98e9add957e50b91",
//     "0xe39cc9b8ce8c9d3a239bc8042cdf870acda5ffe3ba0c850e5ad78ae2d4c9c82e",
//     "0x683b531f41ec88a2f345b727afe59757b73162a340a65c86bba62866f8fe556c",
//     "0x27badc983df1780b60c2b3fa9d3a19a00e46aac798451f0febdca52920faaddf",
//     "0xcf38d95c9c6b1d9d5125c04d41a54df57727ef4cfb3f5116a602fe2b25115c13",
//     "0x6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b"
//   ]
// }