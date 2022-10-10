
export class TypeClass {
  private id: string;
  private name: string;
  private description: string;
  private publicKey: string;

  constructor(
    id: string,
    name: string,
    description: string,    
    publicKey: string,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.publicKey = publicKey;
  }
}
