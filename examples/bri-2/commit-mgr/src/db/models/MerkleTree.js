import { Schema, model } from "mongoose";

// This schema stores information relating to each node of the tree. Note that a leaf shares this same schema.
const merkleTreeSchema = new Schema(
  {
    _id: String,
    treeHeight: {
      type: Number,
      default: 4,
    },
    latestLeaf: {
      blockNumber: Number,
      leafIndex: Number,
    },
    active: Boolean,
    latestRecalculation: {
      blockNumber: Number,
      leafIndex: Number,
      root: String,
      // The frontier contains one value from each level of the tree.
      // By 'level' (as opposed to 'row') we mean: the leaves are at level '0' and the root is at level 'H = TREE_HEIGHT'.
      frontier: {
        type: Array,
        default: new Array(33),
      },
    },
    // Limit 25,000 nodes for each document. If tree has more nodes than that, store in other "buckets"
    // Mongo document size limit = 16MB
    // node size ~ 200b. 200b * 25,000 ~ 5MB
    nodes: [{
      _id: false,
      leafIndex: Number, // Only used for leaves
      blockNumber: Number, // Only used for leaves
      txHash: String, // Only used for leaves
      hash: String // commitment value
    }],
  },
  { versionKey: false }
);

// Automatically generate createdAt and updatedAt fields
merkleTreeSchema.set('timestamps', true);

export const merkleTrees = model('merkle-trees', merkleTreeSchema);
