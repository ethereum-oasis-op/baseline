export class CreateWorkstepCommand {
  private name: string;
  private version: string;
  private status: string;
  private workgroupId: string;
  constructor(
    name: string,
    version: string,
    status: string,
    workgroupId: string,
  ) {
    this.name = name;
    this.version = version;
    this.status = status;
    this.workgroupId = workgroupId;
  }

  public get _name() {
    return this.name;
  }

  public set _name(name: string) {
    this.name = name;
  }

  public get _version() {
    return this.version;
  }

  public set _version(version: string) {
    this.version = version;
  }

  public get _status() {
    return this.status;
  }

  public set _status(status: string) {
    this.status = status;
  }

  public get _workgroupId() {
    return this.workgroupId;
  }

  public set __workgroupId(workgroupId: string) {
    this.workgroupId = workgroupId;
  }
}
