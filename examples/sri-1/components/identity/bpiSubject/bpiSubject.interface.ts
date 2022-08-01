import { BpiSubjectType } from "./bpiSubjectType.enum";

export interface IBpiSubject {
    id: string;
    name: string;
    description: string;
    type: BpiSubjectType;
    publicKey: string;
}