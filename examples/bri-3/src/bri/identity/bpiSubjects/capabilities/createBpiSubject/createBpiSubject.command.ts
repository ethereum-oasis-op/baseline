export class CreateBpiSubjectCommand {

  name: string;
  description: string;
  publicKey: string;

  constructor(name: string, description: string, publicKey: string) {
    this.name = name
    this.description = description
    this.publicKey = publicKey
  }
    
  }
