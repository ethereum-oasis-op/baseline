import { BpiSubject } from "../identity/bpiSubject";
import { Workstep } from "./workstep";

export class Workgroup {
     id: string;
     name: string;
     participants: BpiSubject[] = [];
     worksteps: Workstep[] = [];
     // Set used to store IDs and ensure each ID can only be used once
     workstepIds: Set<string> = new Set("");

    constructor(name: string, id: string, owner: BpiSubject, worksteps: Workstep[],) {
        this.id = id;
        this.name = name;
        this.worksteps = worksteps;
        this.participants.push(owner);
    }

     addWorkstep(workstep: Workstep) {

          //push workstep if ID is not yet in use
          if(!this.workstepIds.has(workstep.id)) {
               this.worksteps.push(workstep);
          }

          //add ID to running set
          this.workstepIds.add(workstep.id);
     }

     getWorkstepById(workstepId: string) {
          const worksteps = this.worksteps.filter(wrkstp => wrkstp.id === workstepId);
          return worksteps.length > 0 && worksteps[0]
     }

     addParticipants(bpiSubject: BpiSubject) {
          this.participants.push(bpiSubject);
     }

     getParticipantsById(id: string): BpiSubject {
          const bpiSubjects = this.participants.filter(bs => bs.id === id);
          return bpiSubjects[0];
     }
}

