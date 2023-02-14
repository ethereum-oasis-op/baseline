import { WorkgroupStatus } from '../../models/workgroup';

export class ArchiveWorkgroupCommand {
  constructor(
    public readonly id: string,
    public readonly status: WorkgroupStatus,
  ) {}
}
