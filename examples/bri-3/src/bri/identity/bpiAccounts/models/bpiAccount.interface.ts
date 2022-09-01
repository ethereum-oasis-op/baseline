export interface IBpiAccount {
    id: string; // TODO: Add uuid after #491
    nonce: string;
    ownerBpiSubjectIds: string[];
}