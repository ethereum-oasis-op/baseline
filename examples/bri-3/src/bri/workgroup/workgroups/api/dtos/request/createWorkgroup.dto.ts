import { BpiSubject } from "src/bri/identity/bpiSubjects/models/bpiSubject";
import { Workflow } from "src/bri/workgroup/workflows/models/workflow";
import { Workstep } from "src/bri/workgroup/worksteps/models/workstep";

export interface CreateWorkgroupDto {
    name: string;
    administrator: BpiSubject[];
    parcitipants: BpiSubject[];
    worksteps: Workstep[];
    workflows: Workflow[];
}
