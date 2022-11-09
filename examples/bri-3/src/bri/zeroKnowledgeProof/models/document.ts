import { AutoMap } from '@automapper/classes';
export class DocumentObject {
  @AutoMap()
  documentObjectType: string;

  @AutoMap()
  documentObjectInput: object;

  constructor(documentObjectType: string, documentObjectInput: object) {
    this.documentObjectType = documentObjectType;
    this.documentObjectInput = documentObjectInput;
  }
}
