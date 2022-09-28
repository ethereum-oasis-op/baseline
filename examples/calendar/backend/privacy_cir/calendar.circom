pragma circom 2.0.3;

include "./../node_modules/circomlib/circuits/comparators.circom";
include "./../node_modules/circomlib/circuits/poseidon.circom";
include "merkleTree.circom";

template AppointmentSchdeule(levels){
    //get date of appointment along with hash of appointment

    // get signal to construct the tree to verify with root of tree
    signal input root;
    //log(root);
    // the actual time slots
    signal input time_slot_leaves[levels];
    
    // given path element is on left or right side of tree with 0 and 1 respectively
    signal input time_slot_indices[levels];

    // get availability of seeker
    signal input selected_time;

    //component commitmentHasher = Poseidon(1);
    //commitmentHasher.inputs[0] <== selected_time;

    component tree = MerkleProof(levels); 
    tree.leaf <== selected_time;

    //log(tree.root);
    for(var i = 0; i < levels; i++) {
        //log(time_slot_indices[i]);
        log(time_slot_leaves[i]);
        tree.pathElements[i] <== time_slot_leaves[i];
        tree.pathIndices[i] <== time_slot_indices[i];
        //log(tree.root);
    }
    log(tree.root);
    log(root);
    tree.root === root;

  
}

component main { public[root, time_slot_indices, time_slot_leaves, selected_time] } = AppointmentSchdeule(5);
