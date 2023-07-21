# Vendor Bank Verification Workflow with BRI-1

## Setup

### Configuration via Provide Shuttle

<b>Create account at https://shuttle.provide.services</b>

[!img](./img/shuttle-signup.PNG)

[!img](./img/org-create.PNG)

<b>Define workgroup</b>

[!img](./img/create-workgroup.PNG)

[!img](./img/workgroup-schema-create.PNG)

[!img](./img/workgroup-network-select.PNG)

[!img](./img/worgroup-finish-onboarding.PNG)

[!img](./img/shuttle-home.PNG)

<b>Configure workflow</b>

[!img](./img/shuttle-newwf.PNG)

[!img](./img/wf-create.PNG)

[!img](./img/wf-addworkstep.PNG)

[!img](./img/wf-workstepsave.PNG)

[!img](./img/wf-deploy.PNG)

[!img](./img/wf-deploy.PNG)

[!img](./img/wf-deploy-success.PNG)

<b> Review protocol messages</b>

### Postman configuration, credentials generation, initial protocol message test

<b>Maintain Shuttle Credentials</b>
Use the email and password in the ```{{shuttle_email}}``` ```{{shuttle_password}}``` collection variables

<b>Generating the refresh and access tokens</b>
Execute Postman requests in the following order
1. Authorize Access Token
2. List organizations
3. JWT Authenticate - Generate long dated refresh token
4. JWT Authenticate - Generate short dated access token from refresh token

<b>Test the protocol messaging from Postman</b>
Go to the Trigger Bank Account Verification request

Add data to the blank fields and execute

Review ZKP in Shuttle

### Node.js Sample Script

<b>Install packages</b>

Run command ```npm install```

<b>Maintain .env file from Postman collection variables</b>

<b>Create Baseline Protocol Message</b>

Run command ```node create_protocol_msg```

### SAP Sample Program

<b>Pre requisities</b>
Use this SAP sample program does require the install and configuration of [proUBC](https://github.com/provideplatform/proubc) as a pre-requisite. Additional details are documented [here](https://docs.provide.services/proubc)

<b>Credentials onboarding to SAP</b>
Use the SAP folder of the Postman collection

Maintain the SAP basic auth credentials in postman

Execute fetch

Execute tenant creation

Review the record in ZPRVDTENANTS table

<b>Program execution</b>
Execute the SAP program via transaction code SE38 or SE80