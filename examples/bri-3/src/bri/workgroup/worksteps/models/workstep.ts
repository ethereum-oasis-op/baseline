import { Security } from '../../../policy/models/security';
import { Privacy } from '../../../policy/models/privacy';

export class Workstep {
  private _id: string; // TODO: Add uuid after #491
  private _name: string;
  private _version: string;
  private _status: string;
  private _workgroupId: string;
  private _securityPolicy: Security; // TODO Implement security policy inhereted from workgroup #487
  private _privacyPolicy: Privacy; // TODO Implement simple privacy policy inhereted from workgroup #487

  constructor(
    id: string,
    name: string,
    version: string,
    status: string,
    workgroupId: string,
    securityPolicy: Security,
    privacyPolicy: Privacy,
  ) {
    this._id = id;
    this._name = name;
    this._version = version;
    this._status = status;
    this._workgroupId = workgroupId;
    this._securityPolicy = securityPolicy;
    this._privacyPolicy = privacyPolicy;
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get version(): string {
    return this._version;
  }

  public get status(): string {
    return this._status;
  }

  public get workgroupId(): string {
    return this._workgroupId;
  }

  public get securityPolicy(): Security {
    return this._securityPolicy;
  }

  public get privacyPolicy(): Privacy {
    return this._privacyPolicy;
  }
}
