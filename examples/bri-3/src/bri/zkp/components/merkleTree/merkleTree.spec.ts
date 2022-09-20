import { MerkleTree } from './merkleTree';

describe('merkleTree', () => {
  it('Should create merkle tree out of empty document', () => {
    const document = {};

    const merkleTree = new MerkleTree(document);
    expect(merkleTree.leaves.length).toEqual(0);
    expect(merkleTree.root).toBeUndefined();
  });

  it('Should create merkle tree out of document', () => {
    const document = {
      name: 'Alice',
      company: 'AliceCo',
    };

    const merkleTree = new MerkleTree(document);
    expect(merkleTree.leaves.length).toEqual(2);
    expect(merkleTree.root).toBeDefined();

    const companyLeaf = merkleTree.leaves[0];
    const nameLeaf = merkleTree.leaves[1];

    expect(companyLeaf.key).toEqual('company');
    expect(nameLeaf.key).toEqual('name');

    const companyLeafValue = Buffer.from(
      companyLeaf.value,
      'base64',
    ).toString();

    expect(companyLeafValue).toEqual(document.company);

    const nameLeafValue = Buffer.from(nameLeaf.value, 'base64').toString();
    expect(nameLeafValue).toEqual(document.name);
  });
});
