import { BpiSubjectType } from "./bpiSubjectType.enum";

export interface IBpiSubject {
    id: string; // TODO: Add uuid after #491
    name: string;
    description: string;
    type: BpiSubjectType;
    publicKey: string;
}