import { BadRequestException, Injectable } from "@nestjs/common";
import { BpiSubject } from "../models/bpiSubject";
import { BpiSubjectType } from "../models/bpiSubjectType.enum";
 
@Injectable()
export class BpiSubjectAgent {
  // Agent methods have extremely declarative names and perform a single task 
  public throwIfCreateBpiSubjectInputInvalid(name: string, desc: string, pk: string) {
    // This is just an example, these fields will be validated on the DTO validation layer
    // This validation would check internal business rules (i.e. bpiSubject must have public key in the format defined by the participants..) 
    if (!name) {
      // We stop execution in case of critical errors by throwing a simple exception
      throw new BadRequestException("Name cannot be empty.")
    };
  } 

  // Agent always works through the methods of the domain object to change it's state
  public createNewExternalBpiSubject(name :string, desc: string, pk: string): BpiSubject {
    return new BpiSubject(name, desc, BpiSubjectType.External, pk);
  }
}