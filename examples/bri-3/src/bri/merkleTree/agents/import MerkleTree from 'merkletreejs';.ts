import MerkleTree from 'merkletreejs';
import * as crypto from 'crypto';


const leaves = [
    'leave1',
    'leave2',
    'leave3',
]

const hashFn = (data: any) => { return data };


const hashedLeaves = leaves.map(l => hashFn(l));

const myTree = new MerkleTree(hashedLeaves, hashFn);


console.log(MerkleTree.marshalTree(myTree));


myTree.addLeaf(hashFn('leave4'))

console.log(MerkleTree.marshalTree(myTree));


console.log(myTree.getLeaf(0))