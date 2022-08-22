import { BpiSubject } from "../../../identity/bpiSubjects/models/bpiSubject";
export type TInvitation = 
{
    id: string; 
    name: string;
    sender: BpiSubject;
    recipient: string;
    workgroupId: string;
}
