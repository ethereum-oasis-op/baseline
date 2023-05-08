import { sha256 } from "js-sha256"
import { ChildNodes, SparseMerkleTree } from "@zk-kit/sparse-merkle-tree"

describe('Sparse Merke Tree tests', () => {
    it('Should produce a JSON representation of the sparse merkle tree with dummy invoice data', async () => {
        const hash = (childNodes: ChildNodes) => sha256(childNodes.join("")).toString()
        const tree = new SparseMerkleTree(hash)

        tree.add("0", "31"); // BpiId:1

        console.log("Adding SupplierInvoiceID") 
        tree.add("1", "494e562d313233"); // SupplierInvoiceID:INV-123

        console.log("Adding BuyerInvoiceId") 
        tree.add("2", "0"); // BuyerInvoiceId:null

        console.log("Adding Amount") 
        tree.add("3", "3330302e3030"); // Amount:300.00

        console.log("Adding IssueDate") 
        tree.add("4", "323032332d30362d3135"); // IssueDate:2023-06-15

        console.log("Adding DueDate") 
        tree.add("5", "323032332d30372d3135"); // DueDate:2023-07-15

        console.log("Adding Status") 
        tree.add("6", "4e4557"); // Status:NEW

        // Invoice items are ignored for now

        const anyTree = tree as any;
        console.log(JSON.stringify(Array.from(anyTree.nodes)));
    });
});  