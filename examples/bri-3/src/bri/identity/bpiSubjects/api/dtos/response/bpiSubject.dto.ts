import { AutoMap } from "@automapper/classes";

export class BpiSubjectDto {
  id: string;
  @AutoMap()
  name: string;
  description: string;
  publicKey: string;
}
