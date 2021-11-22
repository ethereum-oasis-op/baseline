import { Agreement } from "./agreement";
import { BpiSubject } from "./bpiSubject";
import { Workstep } from "./workstep";

export class Workgroup {   
     id: string;
     name: string;
     participants: BpiSubject[] = [];
     agreement: Agreement;

     worksteps: Workstep[] = [];
}

