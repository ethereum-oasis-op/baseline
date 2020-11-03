# Base Example

## Alice & Bob

The reference implementation illustrates Alice & Bob, respective owners of Alice Corp and Bob Corp, establishing a workgroup and _baselining_ an in-memory record \(i.e., a JSON object\) using the Provide stack.

The following high-level architecture diagram illustrates how the concepts discussed in previous sections \(i.e., the Provide and Baseline Protocol architecture sections\) fit together in the context of two organizations deploying the Baseline Protocol using Provide as a common technology stack and their own cloud infrastructure vendors \(i.e., AWS and Azure\). The reference implementation deploys these same two distinct stacks to your local machine using `docker-compose` when running the test suite.

![This reference implementation supports cloud-agnostic experiments out-of-the-box.](../../.gitbook/assets/image%20%282%29.png)

### Initiating the Workgroup

Bob is designated as the initiator of the workgroup and the end-to-end test suite makes assertions as Bob Corp deploys the ERC1820 organization registry contract to the Ropsten testnet, compiles and performs the trusted setup of a zero-knowledge circuit to govern an initial business process among workgroup participants and invites Alice to join the workgroup.

### Decoded Workgroup Invitation JWT

The following JSON object represents the decoded invitation JWT signed by Bob Corp and delivered to Alice. The invitation has everything Alice needs to join Bob's new Baseline workgroup, register Alice Corp with the on-chain `OrgRegistry` contract and use the protocol to synchronize her local Provide stack.

```text
{
  "aud": "https://provide.services/api/v1",
  "exp": 1598074664,
  "iat": 1597988264,
  "iss": "https://ident.provide.services",
  "jti": "6341cb1b-823c-4308-a3c3-48e2d21a1f12",
  "nats": {
    "permissions": {
      "subscribe": {
        "allow": [
          "network.*.connector.*",
          "network.*.status",
          "platform.>"
        ]
      }
    }
  },
  "prvd": {
    "data": {
      "application_id": "b9ad090b-8d3b-4840-a6cf-5e644b242510",
      "email": "alice1597987999175@baseline.local",
      "first_name": null,
      "invitor_id": "33cec010-8950-4dc9-b1cc-b18550769d03",
      "invitor_name": "Bob Baseline",
      "last_name": null,
      "organization_id": null,
      "organization_name": null,
      "params": {
        "authorized_bearer_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYXRzIjp7InBlcm1pc3Npb25zIjp7InB1Ymxpc2giOnsiYWxsb3ciOlsiYmFzZWxpbmUuPiJdfSwic3Vic2NyaWJlIjp7ImFsbG93IjpbImJhc2VsaW5lLmluYm91bmQiXX19fSwiaWF0IjoxNTk4MjM0OTMyLCJleHAiOjE1OTgyMzk5MzIsImF1ZCI6Im5hdHM6Ly9sb2NhbGhvc3Q6NDIyNCIsImlzcyI6InRzLW5hdHN1dGlsIiwic3ViIjoiYmFzZWxpbmUuaW5ib3VuZCJ9.YSDr6avqwQ1xVsptZIsWK8XIGyU-vJxBed11wfmwzODlJSSxkEc66pVcwqOh8oWmQnb75e7kBKxO0_BK4VNb8Jivt3KMnJkiKWW2KhQ2hQXfIMnNIKi-aWblnFm1JzAizVfndnyQdz6HinLqN9ka8msLbyPpQk279i58fpdKOuwP7rRJBOmjrVhyztf5hdv7HdGrB49T3hzfbfX8lijzABtcnHnQmfvbXggdbVCzqAoiee6_x-uOHNHtVc2wXcqdUl_JvDh5uyyJ_wNEsRQ8_559PqXSujtKVKXt2t38rFXm1SigT7g2WiXiuJSHna8yICw98djJzba76v6AJUB-ltHDnyeTNqMZxOJS51dluKlUxVjFSwwR7zd_jFHu6dsdCRrs_2rWdU-PaG8GPppSgNVaBKpKT-YNieVV1xCl8clXVZ32LovawUryh-JlAGkbPtrqzBQmWY0AZRblSzz-yai7xMy4DTXK2PCw3gWmeR3dg3im476Qz5WupfGPBJ7BJh1Ya_juqnr6FquFGW60G6o6OJLHdeReCQNkgRXdU7-gA2qtaBACenEKECM5xufkesGgKIP426oLExBkMDQD_B4afO58seTT6Tc5gNlTV_Ev9j8boHfgBmTuqVoxfmdu5JIrj6Y9yktLOLiC25qHw9tFy6V5keZKDk_hokFCINA",
        "erc1820_registry_contract_address": "0xd5e4EA677FcBb9961c7338570b8cBb6AfE36C0d6",
        "invitor_organization_address": "0xa3AC1eC4609a38B9789860DCfB46063b80B7bb7a",
        "organization_registry_contract_address": "0x6a0A2E71381649879eF99acA31c14220cFa7EA60",
        "shield_contract_address": "0xf2e246bb76df876cef8b38ae84130f4f55de395b",
        "verifier_contract_address": "0xdc35F1CD0427D06Ab7e6ebDfC604ef12eFC1f06b",
        "workflow_identifier": "3b773331-cd38-4ee3-8cbb-74960d0268d1"
      },
      "user_id": null
    },
    "permissions": 0
  },
  "sub": "invite:alice1597987999175@baseline.local"
}
```

### Accepting the Workgroup Invitation

Alice accepts the invitation and synchronizes with the on- and off-chain state of the workgroup. Following Alice's acceptance of Bob's invitation on behalf of Alice Corp, both organizations have been registered with the on-chain `OrgRegistry` contract; both organizations are running their own local, off-chain copy of the organization registry, workgroup contracts registry and merkle tree database.

