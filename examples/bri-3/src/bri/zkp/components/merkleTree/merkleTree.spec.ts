import { MerkleTree } from './merkleTree';

describe('Create a Merkle Tree and return a unique root', () => {
  it('Should create merkle tree out of document', () => {
    const document = {
      name: 'Alice',
      company: 'AliceCo',
    };

    const merkleTree = new MerkleTree(document);
    expect(merkleTree.getTree().leaves.length).toEqual(2);
    expect(merkleTree.getTree().root).toBeDefined();

    const companyLeaf = merkleTree.getTree().leaves[0];
    const nameLeaf = merkleTree.getTree().leaves[1];

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
