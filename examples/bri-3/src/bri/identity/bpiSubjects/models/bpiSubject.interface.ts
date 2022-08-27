import { BpiSubjectType } from "./bpiSubjectType.enum";

// TODO: Do we actually need interfaces as we are already working with classes?
export interface IBpiSubject {
    id: string; // TODO: Add uuid after #491
    name: string;
    description: string;
    type: BpiSubjectType;
    publicKey: string;
}