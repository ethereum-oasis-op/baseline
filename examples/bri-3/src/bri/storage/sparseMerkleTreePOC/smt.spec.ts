import { sha256 } from 'js-sha256';
import { ChildNodes, SparseMerkleTree } from '@zk-kit/sparse-merkle-tree';

describe('Sparse Merke Tree tests', () => {
  it('Should produce a JSON representation of the sparse merkle tree with dummy invoice data', async () => {
    const hash = (childNodes: ChildNodes) =>
      sha256(childNodes.join('')).toString();
    const tree = new SparseMerkleTree(hash);

    tree.add('0', '31'); // BpiId:1

    tree.add('1', '494e562d313233'); // SupplierInvoiceID:INV-123

    tree.add('2', '0'); // BuyerInvoiceId:null

    tree.add('3', '3330302e3030'); // Amount:300.00

    tree.add('4', '323032332d30362d3135'); // IssueDate:2023-06-15

    tree.add('5', '323032332d30372d3135'); // DueDate:2023-07-15

    tree.add('6', '4e4557'); // Status:NEW

    // Invoice items are ignored for now

    const anyTree = tree as any;
    console.log(JSON.stringify(Array.from(anyTree.nodes)));
  });
});
