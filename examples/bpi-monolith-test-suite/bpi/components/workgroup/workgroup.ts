import { BpiSubject } from "../identity/bpiSubject";
import { Workstep } from "./workstep";

export class Workgroup {
     id: string;
     name: string;
     participants: BpiSubject[] = [];
     worksteps: Workstep[] = [];

    constructor(name: string, id: string, owner: BpiSubject, worksteps: Workstep[],) {
        this.name = name;
        this.id = id;
        this.worksteps = worksteps;
        this.participants.push(owner);
    }

     addWorkstep(workstep: Workstep) {
          this.worksteps.push(workstep);
     }

     getWorkstepById(workstepId: string) {
          const worksteps = this.worksteps.filter(wrkstp => wrkstp.id === workstepId);
          return worksteps[0];
     }

     addParticipants(bpiSubject: BpiSubject) {
          this.participants.push(bpiSubject);
     }

     getParticipantsById(id: string): BpiSubject {
          const bpiSubjects = this.participants.filter(bs => bs.id === id);
          return bpiSubjects[0];
     }
}

