// eslint-disable-next-line no-unused-vars
import { ProvideClient, authenticate, authenticateStub, restore, restoreStub } from "../client/provide-client";
// eslint-disable-next-line no-unused-vars
import { Application, Mapping, MappingField, MappingModel, Workflow, Workstep } from "@provide/types";
import { alerts, spinnerOff, spinnerOn } from "../common/alerts";
import { LoginFormData } from "../models/login-form-data";
import { onError } from "../common/common";
import { excelWorker } from "./excel-worker";
import { mappingForm, MappingForm } from "./mappingForm";
import { store } from "../settings/store";
import { TokenStr } from "../models/common";
import { User } from "../models/user";
import { showJwtInputDialog } from "../dialogs/dialogs-helpers";
import { myWorkflow } from "./workflow";
import { myWorkstep } from "./workstep";
import * as $ from "jquery";

// images references in the manifest
import "../../assets/icon-16.png";
import "../../assets/icon-32.png";
import "../../assets/icon-80.png";
import "../../assets/logo-filled.png";

import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/js/fontawesome";
import "@fortawesome/fontawesome-free/js/solid";
import "@fortawesome/fontawesome-free/js/regular";
import "@fortawesome/fontawesome-free/js/brands";
import "./taskpane.css";

const stubAuth = false;

// eslint-disable-next-line no-unused-vars
/* global Excel, OfficeExtension, Office */

let identClient: ProvideClient | null;
let currentWorkgroupId: string | null;
let currentWorkflowId: string | null;

Office.onReady((info) => {
  if (info.host === Office.HostType.Excel) {
    $(function () {
      initUi();

      tryRestoreAutorization();
    });
  }
});

// eslint-disable-next-line no-unused-vars
function tryRestoreAutorization() {
  return Promise.all([store.getRefreshToken(), store.getUser()]).then(([refreshToken, user]) => {
    if (!refreshToken || !user) {
      setUiForLogin();
      spinnerOff();
      return;
    }

    const restoreFn = stubAuth ? restoreStub : restore;
    spinnerOn();
    return restoreFn(refreshToken, user).then(
      (client) => {
        identClient = client;
        setUiAfterLogin();
        spinnerOff();
      },
      (reason) => {
        store.removeTokenAndUser();
        setUiForLogin();
        onError(reason);
      }
    );
  });
}

function initUi() {
  $("#login-btn").on("click", onLogin);
  $("#logout-btn").on("click", onLogout);
  $("#refresh-workgroups-btn").on("click", onFillWorkgroups);
  $("#refresh-workflows-btn").on("click", onFillWorkflows);
  $("#refresh-worksteps-btn").on("click", onFillWorksteps);
  $("#show-jwt-input-btn").on("click", onGetJwtokenDialog);
  $("#mapping-form-btn").on("click", onSubmitMappingForm);
  $("#workflow-form-btn").on("click", onSubmitCreateWorkflowForm);
  $("#workstep-form-btn").on("click", onSubmitCreateWorkstepForm);
}

function setUiForLogin() {
  $("#sideload-msg").hide();
  $("#login-ui").show();
  $("#workgroup-ui").hide();
  $("#mapping-ui").hide();
  $("#app-body").show();
}

function setUiAfterLogin() {
  $("#sideload-msg").hide();
  let $workUi = $("#workgroup-ui");
  const userName = (identClient.user || {}).name || "unknow";
  $("#user-name", $workUi).text(userName);
  $("#login-ui").hide();
  $workUi.show();
  $("#mapping-ui").hide();
  $("#workflow-ui").hide();
  $("#workflow-create-ui").hide();
  $("#workstep-ui").hide();
  $("#workstep-create-ui").hide();
  $("#workstep-details-ui").hide();
  $("#app-body").show();
}

function setUiForMapping() {
  $("#sideload-msg").hide();
  $("#login-ui").hide();
  let $workUi = $("#workgroup-ui");
  const userName = (identClient.user || {}).name || "unknow";
  $("#user-name", $workUi).text(userName);
  $("#workgroup-ui").hide();
  $("#mapping-ui").show();
  $("#workflow-ui").hide();
  $("#workflow-create-ui").hide();
  $("#workstep-ui").hide();
  $("#workstep-create-ui").hide();
  $("#workstep-details-ui").hide();
  $("#app-body").show();
}

function setUiForWorkflows() {
  $("#sideload-msg").hide();
  $("#login-ui").hide();
  let $workUi = $("#workgroup-ui");
  const userName = (identClient.user || {}).name || "unknow";
  $("#user-name", $workUi).text(userName);
  $("#workgroup-ui").hide();
  $("#workflow-ui").show();
  $("#mapping-ui").hide();
  $("#workflow-create-ui").hide();
  $("#workstep-ui").hide();
  $("#workstep-create-ui").hide();
  $("#workstep-details-ui").hide();
  $("#app-body").show();
}

function setUiForCreateWorkflow() {
  $("#sideload-msg").hide();
  $("#login-ui").hide();
  let $workUi = $("#workgroup-ui");
  const userName = (identClient.user || {}).name || "unknow";
  $("#user-name", $workUi).text(userName);
  $("#workgroup-ui").hide();
  $("#mapping-ui").hide();
  $("#workflow-ui").hide();
  $("#workflow-create-ui").show();
  $("#workstep-ui").hide();
  $("#workstep-create-ui").hide();
  $("#workstep-details-ui").hide();
  $("#app-body").show();
}

function setUiForWorksteps() {
  $("#sideload-msg").hide();
  $("#login-ui").hide();
  let $workUi = $("#workgroup-ui");
  const userName = (identClient.user || {}).name || "unknow";
  $("#user-name", $workUi).text(userName);
  $("#workgroup-ui").hide();
  $("#mapping-ui").hide();
  $("#workflow-ui").hide();
  $("#workflow-create-ui").hide();
  $("#workstep-ui").show();
  $("#workstep-create-ui").hide();
  $("#workstep-details-ui").hide();
  $("#app-body").show();
}

function setUiForCreateWorkstep() {
  $("#sideload-msg").hide();
  $("#login-ui").hide();
  let $workUi = $("#workgroup-ui");
  const userName = (identClient.user || {}).name || "unknow";
  $("#user-name", $workUi).text(userName);
  $("#workgroup-ui").hide();
  $("#mapping-ui").hide();
  $("#workflow-ui").hide();
  $("#workflow-create-ui").hide();
  $("#workstep-ui").hide();
  $("#workstep-create-ui").show();
  $("#workstep-details-ui").hide();
  $("#app-body").show();
}

function setUiForWorkStepDetails() {
  $("#sideload-msg").hide();
  $("#login-ui").hide();
  let $workUi = $("#workgroup-ui");
  const userName = (identClient.user || {}).name || "unknow";
  $("#user-name", $workUi).text(userName);
  $("#workgroup-ui").hide();
  $("#mapping-ui").hide();
  $("#workflow-ui").hide();
  $("#workflow-create-ui").hide();
  $("#workstep-ui").hide();
  $("#workstep-create-ui").hide();
  $("#workstep-details-ui").show();
  $("#app-body").show();
}

async function onLogin(): Promise<void> {
  await store.open();
  const $form = $("#login-ui form");
  const loginFormData = new LoginFormData($form);
  const isValid = loginFormData.isValid();
  if (isValid !== true) {
    alerts.error(<string>isValid);
    return;
  }

  const authenticateFn = stubAuth ? authenticateStub : authenticate;
  spinnerOn();
  return authenticateFn(loginFormData)
    .then(async (client) => {
      identClient = client;

      loginFormData.clean();
      setUiAfterLogin();

      const token: TokenStr = identClient.userRefreshToken;
      const user: User = { id: identClient.user.id, name: identClient.user.name, email: identClient.user.email };

      await store.removeTokenAndUser();
      return store.setTokenAndUser(token, user).then(spinnerOff);
    }, onError)
    .then(getMyWorkgroups)
    .then(startBaselining);
}

function onLogout() {
  identClient
    .logout()
    .then(async () => {
      identClient = null;
      await store.removeTokenAndUser();
      return await store.close();
    }, onError)
    .then(() => {
      setUiForLogin();
      spinnerOff();
    }, onError);
}

function onFillWorkgroups(): Promise<unknown> {
  return getMyWorkgroups();
}

function onFillWorkflows(): Promise<unknown> {
  return getMyWorkflows(currentWorkgroupId);
}

function onFillWorksteps(): Promise<unknown> {
  return getMyWorksteps(currentWorkflowId);
}

// eslint-disable-next-line no-unused-vars
function onShowMainPage() {
  if (!identClient) {
    setUiForLogin();
    return;
  }

  setUiAfterLogin();

  const token: TokenStr = identClient.userRefreshToken;
  const user: User = { id: identClient.user.id, name: identClient.user.name, email: identClient.user.email };

  return store.setTokenAndUser(token, user).then(spinnerOff).then(getMyWorkgroups, onError);
}

function onGetJwtokenDialog() {
  showJwtInputDialog().then(
    // NOTE: For demo - send data to dialog - part 1
    // showJwtInputDialog({ data: "Test JWT" }).then(
    (jwtInput) => {
      spinnerOn();
      return identClient.acceptWorkgroupInvitation(jwtInput.jwt, jwtInput.orgId).then(() => {
        spinnerOff();
        alerts.success("Invitation completed");
      }, onError);
    },
    () => {
      /* NOTE: On cancel - do nothing */
    }
  );
}

function getMyWorkgroups(): Promise<void> {
  if (!identClient) {
    setUiForLogin();
    return;
  }

  setUiAfterLogin();
  return identClient.getWorkgroups().then(async (apps) => {
    await excelWorker.showWorkgroups("My Workgroups", apps);
    return await activateWorkgroupButtons(apps).then(spinnerOff);
  }, onError);
}

async function activateWorkgroupButtons(applications: Application[]): Promise<void> {
  applications.map((app) => {
    //Get the buttons elements
    $("#" + app.id).on("click", function () {
      getMyWorkflows(app.id);
    });
    //Add Events to it
  });
}

async function getMyWorkflows(appId: string): Promise<void> {
  if (!identClient) {
    setUiForLogin();
    return;
  }

  setUiForWorkflows();

  currentWorkgroupId = appId;

  //Prepare back button
  $("#workflow-back-btn").on("click", function () {
    getMyWorkgroups();
  });

  //Prepare logout button
  $("#workflow-ui #logout-btn").on("click", onLogout);

  //Show Mappings
  excelWorker.showMappingButton();
  activateMappingButton(appId);

  //Create workflow
  activateWorkflowCreateButton(appId);

  //Show Workflows
  return identClient.getWorkflows(appId).then(async (workflows) => {
    if (workflows.length > 0) {
      await excelWorker.showWorkflows(workflows);
      return await activateWorkflowButtons(workflows).then(spinnerOff);
    }
    spinnerOff();

    return;
  }, onError);
}

async function activateWorkflowButtons(workflows: Workflow[]): Promise<void> {
  workflows.map((workflow) => {
    //Get the buttons elements
    $("#" + workflow.id).on("click", function () {
      getMyWorksteps(workflow.id);
    });
  });
}

async function activateWorkflowCreateButton(workgroupId: string): Promise<void> {
  $("#create-workflow").on("click", function () {
    createWorkflow(workgroupId);
  });
}

async function activateMappingButton(appId: string): Promise<void> {
  $("#mapping-btn").on("click", function () {
    confirmMappings(appId);
  });
}

async function createWorkflow(workgroupId: string): Promise<void> {
  if (!identClient) {
    setUiForLogin();
    return;
  }

  setUiForCreateWorkflow();

  //Prepare logout button
  $("#workflow-create-ui #logout-btn").on("click", onLogout);

  $("#create-workflow-back-btn").on("click", function () {
    getMyWorkflows(workgroupId);
  });

  myWorkflow.showCreateWorkflowForm();
}

async function onSubmitCreateWorkflowForm(): Promise<unknown> {
  var workflowName = $("#workflow-create-form #workflow-name").val().toString();
  var workgroupId = currentWorkgroupId;
  var status = "draft";
  var version = $("#workflow-create-form #version").val().toString();

  var params: Object = {
    name: workflowName,
    workgroup_id: workgroupId,
    status: status,
    version: version,
  };

  return identClient.createWorkflow(params).then(async () => {
    return await getMyWorkflows(workgroupId).then(spinnerOff);
  }, onError);
}

async function getMyWorksteps(workflowId: string): Promise<void> {
  if (!identClient) {
    setUiForLogin();
    return;
  }

  setUiForWorksteps();

  currentWorkflowId = workflowId;

  $("#workstep-back-btn").on("click", function () {
    getMyWorkflows(currentWorkgroupId);
  });

  //Prepare logout button
  $("#workstep-ui #logout-btn").on("click", onLogout);

  //Create workstep
  activateWorkstepCreateButton(workflowId);

  //Show worksteps
  return identClient.getWorksteps(workflowId).then(async (worksteps) => {
    if (worksteps && worksteps.length) {
      await excelWorker.showWorksteps(worksteps);
      return await activateWorkstepButtons(worksteps).then(spinnerOff);
    }
    spinnerOff;
    return;
  }, onError);
}

async function activateWorkstepButtons(worksteps: Workstep[]): Promise<void> {
  worksteps.map((workstep) => {
    //Get the buttons elements
    $("#" + workstep.id).on("click", function () {
      showWorkstepDetails(workstep.id);
    });
  });
}

async function activateWorkstepCreateButton(workflowId: string): Promise<void> {
  $("#create-workstep").on("click", function () {
    createWorkstep(workflowId);
  });
}

async function createWorkstep(workflowId: string): Promise<void> {
  if (!identClient) {
    setUiForLogin();
    return;
  }

  setUiForCreateWorkstep();

  $("#create-workstep-back-btn").on("click", function () {
    getMyWorksteps(workflowId);
  });

  //Prepare logout button
  $("#workstep-create-ui #logout-btn").on("click", onLogout);

  myWorkstep.showCreateWorkstepForm();
}

async function onSubmitCreateWorkstepForm(): Promise<unknown> {
  var workstepName = $("#workstep-create-form #workstep-name").val().toString();
  var params = {
    name: workstepName,
    status: "draft",
    require_finality: true,
    metadata: {
      prover: {
        identifier: "cubic",
        provider: "gnark",
        proving_scheme: "groth16",
        curve: "BN254",
      },
    },
  };

  return identClient.createWorkstep(currentWorkflowId, params).then(async () => {
    return await getMyWorksteps(currentWorkflowId).then(spinnerOff);
  }, onError);
}

async function showWorkstepDetails(workstepId: string): Promise<void> {
  if (!identClient) {
    setUiForLogin();
    return;
  }

  await identClient.getWorkstepDetails(currentWorkflowId, workstepId).then(async (workstep) => {
    setUiForWorkStepDetails();

    $("#workstep-details-back-btn").on("click", function () {
      getMyWorksteps(currentWorkgroupId);
    });

    //Prepare logout button
    $("#workstep-details-ui #logout-btn").on("click", onLogout);

    await myWorkstep.showWorkstepDetails(workstep);
  });
}
async function confirmMappings(appId: string): Promise<void> {
  if (!identClient) {
    setUiForLogin();
    return;
  }

  setUiForMapping();

  //Prepare back button
  $("#mapping-back-btn").on("click", function () {
    getMyWorkflows(appId);
  });

  //Prepare logout button
  $("#mapping-ui #logout-btn").on("click", onLogout);

  return identClient.getWorkgroupMappings(appId).then(async (mappings) => {
    if (mappings && mappings.length) {
      return await mappingForm.showWorkgroupMappings(mappings);
    }

    return await mappingForm.showUnmappedColumns(appId);
  }, onError);
}

async function onSubmitMappingForm(): Promise<unknown> {
  return initializeBaselining(mappingForm);
}

function startBaselining(): Promise<void> {
  return excelWorker.startBaselineService(identClient);
}

async function initializeBaselining(mappingForm: MappingForm): Promise<unknown> {
  spinnerOn();
  return excelWorker.createInitialSetup(mappingForm).then(spinnerOff, onError);
}
