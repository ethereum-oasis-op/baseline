import { ProvideClient, authenticate, authenticateStub, restore, restoreStub } from "../client/provide-client";
// eslint-disable-next-line no-unused-vars
import { Application, Mapping, MappingField, MappingModel } from "@provide/types";
import { alerts, spinnerOff, spinnerOn } from "../common/alerts";
import { LoginFormData } from "../models/login-form-data";
import { onError } from "../common/common";
import { excelWorker } from "./excel-worker";
import { mappingForm, MappingForm } from "./mappingForm";
//import { unmapped } from "./unmapped";
import { sessionSettings as session } from "../settings/settings";
//import { diskStorage } from "../settings/settings";
import { TokenStr } from "../models/common";
import { User } from "../models/user";
import { showJwtInputDialog } from "../dialogs/dialogs-helpers";
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
//let mappingForm: MappingForm;

Office.onReady((info) => {
  if (info.host === Office.HostType.Excel) {
    $(function () {
      initUi();

      tryRestoreAutorization().then(getMyWorkgroups).then(startBaselining);
    });
  }
});

function tryRestoreAutorization() {
  return Promise.all([session.getRefreshToken(), session.getUser()]).then(([refreshToken, user]) => {
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
        session.removeTokenAndUser();
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
  $("#show-jwt-input-btn").on("click", onGetJwtokenDialog);
  $("#back-btn").on("click", onShowMainPage);
  $("#mapping-form-btn").on("click", onSubmitMappingForm);
}

function setUiForLogin() {
  $("#sideload-msg").hide();
  $("#login-ui").show();
  $("#work-ui").hide();
  $("#workgroup-ui").hide();
  $("#app-body").show();
}

function setUiAfterLogin() {
  $("#sideload-msg").hide();
  let $workUi = $("#work-ui");
  const userName = (identClient.user || {}).name || "unknow";
  $("#user-name", $workUi).text(userName);
  $("#login-ui").hide();
  $workUi.show();
  $("#workgroup-ui").hide();
  $("#app-body").show();
}

function setUiForWorkgroups() {
  $("#sideload-msg").hide();
  $("#login-ui").hide();
  let $workUi = $("#work-ui");
  const userName = (identClient.user || {}).name || "unknow";
  $("#user-name", $workUi).text(userName);
  $("#work-ui").hide();
  $("#workgroup-ui").show();
  $("#app-body").show();
}


function onLogin(): Promise<void> {
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
    .then((client) => {
      identClient = client;

      loginFormData.clean();
      setUiAfterLogin();

      const token: TokenStr = identClient.userRefreshToken;
      const user: User = { id: identClient.user.id, name: identClient.user.name, email: identClient.user.email };

      return session.setTokenAndUser(token, user).then(spinnerOff);
    }, onError)
    .then(getMyWorkgroups)
    .then(startBaselining);
}

function onLogout() {
  if (!identClient) {
    setUiForLogin();
    return;
  }

  identClient
    .logout()
    .then(() => {
      identClient = null;
      return session.removeTokenAndUser();
    }, onError)
    .then(() => {
      setUiForLogin();
      spinnerOff();
    }, onError);
}

function onFillWorkgroups(): Promise<unknown> {
  return getMyWorkgroups();
}

function onShowMainPage() {
  if (!identClient) {
    setUiForLogin();
    return;
  }

  setUiAfterLogin();

  const token: TokenStr = identClient.userRefreshToken;
  const user: User = { id: identClient.user.id, name: identClient.user.name, email: identClient.user.email };

  return session.setTokenAndUser(token, user).then(spinnerOff).then(getMyWorkgroups, onError);
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

  spinnerOn();
  return identClient.getWorkgroups().then(async (apps) => {
    await excelWorker.showWorkgroups("My Workgroups", apps);
    return await activateWorkgroupButtons(apps).then(spinnerOff);
  }, onError);
}

async function activateWorkgroupButtons(applications: Application[]) : Promise<void>{
  applications.map((app) => {
   //Get the buttons elents
   $("#" + app.id).on("click", function () {
     confirmMappings(app.id);
   });
   //Add Events to it
    
  });
}


async function confirmMappings(appId: string): Promise<void>{
  if (!identClient) {
    setUiForLogin();
    return;
  }
  
  setUiForWorkgroups();

 return identClient.getWorkgroupMappings(appId).then(async (mappings) => { 
    if(mappings && mappings.length){
      return await mappingForm.showWorkgroupMappings(mappings); 
    } 
    return await mappingForm.showUnmappedColumns(appId);
  }, onError);
}

async function onSubmitMappingForm(): Promise<unknown> {
  return initializeBaselining(mappingForm);
}

function startBaselining(): Promise<void> {
  if (!identClient) {
    setUiForLogin();
    return;
  }
  return excelWorker.startBaselineService(identClient);
}

async function initializeBaselining(mappingForm: MappingForm): Promise<unknown> {
  if(!identClient) {
    setUiForLogin();
    return;
  }

  spinnerOn();
  return excelWorker.createInitialSetup(mappingForm).then(spinnerOff, onError);
}