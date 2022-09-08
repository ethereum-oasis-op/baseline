export class CreateBpiSubjectCommand {

  private name: string;
  private description: string;
  private publicKey: string;

  constructor(
    name: string, 
    description: string, 
    publicKey: string
) {
    this.name = name
    this.description = description
    this.publicKey = publicKey
  }
  
  get _name() { return this.name}
  get _description() { return this.description}
  get _publicKey() { return this.publicKey}

  set _name(name: string) {
    this.name = name;
  }

  set _description(description: string) {
    this.description = description;
  }

  set _publicKey(publicKey: string) {
    this.publicKey = publicKey;
  }

  get() { return this}
}
