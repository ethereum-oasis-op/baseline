# Session 1

## Introduction 
- At first everything will be mocked
- After that specific components can/will be added
- Went trough notes from previous session

## Notes

Workgroups consists of multiple BPI (Baseline Protocol Instance) subjects, one of them creates the workgroup and invites the other participants.

[R237] A workgroup MUST consist of at least one BPI Subject participant.

First test block:
- Alice creates an organization defined by a name and id
- Alice searches for a non existing organization
- Alice creates a workgroup defined by a name and id
- Alice searches for a non existing workgroup

## Questions

* OrgRegistry contract is in the core repo. Is this still a proper way to register and  search for new organization?


# Session 2

## Notes

- Agreement was added as the first document to be sent with an invite
- Worksteps was added to execute the checks in the agreement

Test blocks extended:
- Alice creates a workgroup and her organisation is automatically added as the owner
- Alice creates a workgroup with agreement and worksteps

## Questions/idees
* Who keeps the state of the workflow? Is it in the agreement object? Who performs the state changes?
* In the future add workstep status
* Change test titles so they are more descriptive 