import { BpiAccount } from 'src/bri/identity/bpiAccounts/models/bpiAccount';
import { BpiSubject } from 'src/bri/identity/bpiSubjects/models/bpiSubject';
import {
  BpiSubjectRole,
  BpiSubjectRoleName,
} from 'src/bri/identity/bpiSubjects/models/bpiSubjectRole';
import { Workstep } from 'src/bri/workgroup/worksteps/models/workstep';
import { uuid } from 'uuidv4';
import {
  BpiSubjectAccountBuilder,
  BpiSubjectBuilder,
  WorkflowBuilder,
  WorkgroupBuilder,
  WorkstepBuilder,
} from './builders';
import { Workflow } from 'src/bri/workgroup/workflows/models/workflow';

// A place to encapsulate  creation of test data objects used for controller testing.
// These objects will later be used to mock prisma.client calls only once during test bootstrap
// (https://www.prisma.io/docs/guides/testing/unit-testing)
// which will help avoid the need to mock all agents separately
export class TestDataHelper {
  public static createTestWorkstep = (workgroupId: string) => {
    const workstep = new WorkstepBuilder()
      .setId('123')
      .setName('Example Workstep')
      .setVersion('1.0')
      .setStatus('Active')
      .setWorkgroupId(workgroupId)
      .build();

    return workstep;
  };

  public static createTestWorkflow = (
    worksteps: Workstep[],
    bpiAccount: BpiAccount,
  ) => {
    const workflow = new WorkflowBuilder()
      .setId('123')
      .setName('Example Workflow')
      .setWorksteps(worksteps)
      .setWorkgroupId('456')
      .setBpiAccount(bpiAccount)
      .build();

    return workflow;
  };

  public static createBpiSubject = () => {
    const bpiSubject = new BpiSubjectBuilder()
      .setId(uuid())
      .setName('name')
      .setDescription('desc')
      .setPublicKey('pk')
      .setRoles([
        new BpiSubjectRole(
          uuid(),
          BpiSubjectRoleName.EXTERNAL_BPI_SUBJECT,
          'desc',
        ),
      ])
      .build();

    return bpiSubject;
  };

  public static createWorkgroup = (
    admins: BpiSubject[],
    participants: BpiSubject[],
    worksteps: Workstep[],
    workflows: Workflow[],
  ) => {
    const workgroup = new WorkgroupBuilder()
      .setAdministrators(admins)
      .setSecurityPolicy('security policy')
      .setPrivacyPolicy('privacy policy')
      .setParticipants(participants)
      .setWorksteps(worksteps)
      .setWorkflows(workflows)
      .build();

    return workgroup;
  };

  public static createBpiSubjectAccount = (
    owner: BpiSubject,
    creator: BpiSubject,
  ) => {
    const bpiSubjectAccount = new BpiSubjectAccountBuilder()
      .setId(uuid())
      .setOwnerBpiSubject(owner)
      .setCreatorBpiSubject(creator)
      .setAuthenticationPolicy('authentication policy')
      .setAuthorizationPolicy('authorization policy')
      .setVerifiableCredential('verifiable credential')
      .setRecoveryKey('recovery key')
      .build();

    return bpiSubjectAccount;
  };
}
