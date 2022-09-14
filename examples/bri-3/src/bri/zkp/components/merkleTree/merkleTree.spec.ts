import { MerkleTree } from './merkleTree';

describe('Create a Merkle Tree and return a unique root', () => {
  it('Should return the same merkle tree root if the input document is same', () => {
    const document1 = {
      name: 'Alice',
      company: 'AliceCo',
    };

    const document2 = {
      name: 'Alice',
      company: 'AliceCo',
    };

    const merkleTree1 = new MerkleTree(document1);
    const root1 = merkleTree1.getRoot();

    const merkleTree2 = new MerkleTree(document2);
    const root2 = merkleTree2.getRoot();

    expect(root1).toEqual(root2);
  });
  it('Should return different merkle tree root if the input document is different', () => {
    const document1 = {
      name: 'Alice',
      company: 'AliceCo',
    };

    const document2 = {
      name: 'Bob',
      company: 'BobCo',
    };

    const merkleTree1 = new MerkleTree(document1);
    const root1 = merkleTree1.getRoot();

    const merkleTree2 = new MerkleTree(document2);
    const root2 = merkleTree2.getRoot();

    expect(root1).not.toEqual(root2);
  });
});
