export const MERKLE_TREE_NOT_FOUND = (id: string) =>
  `Merkle tree with id: ${id} does not exist.`;

export const HASH_ALG_NOT_SUPPORTED = (hashAlgName: string) =>
  `Hash algorithm ${hashAlgName} is not supported`;
