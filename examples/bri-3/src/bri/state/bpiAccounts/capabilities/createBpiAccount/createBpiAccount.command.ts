export class CreateBpiAccountCommand {
  constructor(public readonly ownerBpiSubjectAccountsIds: string[]) {}
}
