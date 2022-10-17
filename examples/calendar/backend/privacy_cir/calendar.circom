pragma circom 2.0.3;

include "./../node_modules/circomlib/circuits/comparators.circom";
include "./../node_modules/circomlib/circuits/poseidon.circom";
include "merkleTree.circom";

template AppointmentSchdeule(levels){
    //get date of appointment along with hash of appointment

    // get signal to construct the tree to verify with root of tree
    signal input root;

    // the actual time slots
    signal input time_slot_leaves[levels];
    
    // given path element is on left or right side of tree with 0 and 1 respectively
    signal input time_slot_indices[levels];

    // get availability of seeker
    signal input selected_time;

    // creation of merkel tree with levels
    component tree = MerkleProof(levels); 
    tree.leaf <== selected_time;

    //insertion of leaves
    for(var i = 0; i < levels; i++) {
        tree.pathElements[i] <== time_slot_leaves[i];
        tree.pathIndices[i] <== time_slot_indices[i];
    }
    // making sure the root of tree = computed root of tree from leaves. 
    tree.root === root;

  
}

component main { public[root, time_slot_indices, time_slot_leaves, selected_time] } = AppointmentSchdeule(5);
