import { BpiSubject } from "../../identity/bpiSubject/bpiSubject";
export type TInvitation = 
{
    id: string; 
    name: string;
    sender: BpiSubject;
    recipient: string;
    workgroupId: string;
}
