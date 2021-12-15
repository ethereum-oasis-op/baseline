// NOTE: Incapsulate working with storages

/* global Office */

import { TokenStr } from "../models/common";
import { User } from "../models/user";

//import { getOriginPrivateDirectory } from "native-file-system-adapter";
//import cacheAdapter from "native-file-system-adapter/src/adapters/cache";

export interface ISettingsStorage {
  // eslint-disable-next-line no-unused-vars
  set(key: string, value: any): Promise<void>;
  // eslint-disable-next-line no-unused-vars
  get(key: string): Promise<any>;
  // eslint-disable-next-line no-unused-vars
  remove(key: string): Promise<void>;
}

class DocumentSettings implements ISettingsStorage {
  set(key: string, value: any): Promise<void> {
    Office.context.document.settings.set(key, value);
    return this.save();
  }
  get(key: string): Promise<any> {
    const value = Office.context.document.settings.get(key);
    return Promise.resolve(value);
  }
  remove(key: string): Promise<void> {
    Office.context.document.settings.remove(key);
    return this.save();
  }

  private save(): Promise<void> {
    const promise = new Promise<void>((resolve, reject) => {
      Office.context.document.settings.saveAsync(function (asyncResult) {
        if (asyncResult.status == Office.AsyncResultStatus.Failed) {
          // reject('Settings save failed. Error: ' + asyncResult.error.message);
          reject(asyncResult.error.message);
        } else {
          resolve();
        }
      });
    });

    return promise;
  }
}

// class FileSettings implements ISettingsStorage {
//   private fileHandle;
//   private dirHandle;

//   private async createFile(): Promise<void> {
//     console.log("create file");
//     this.dirHandle = await getOriginPrivateDirectory(cacheAdapter);
//     this.fileHandle = await this.dirHandle.getFileHandle("userInfo.txt", { create: true });
//   }

//   async set(key: string, value: any): Promise<void> {
//     console.log("set key");
//     if (!this.fileHandle) {
//       await this.createFile();
//     }

//     const obj = { key: value };
//     const blob = new Blob([JSON.stringify(obj)], { type: "text/plain" });

//     var writer = this.fileHandle.createWritable();
//     await writer.write(blob);
//     await writer.close();
//   }

//   async get(key: string): Promise<any> {
//     const file = await this.fileHandle.getFile();
//     const contents = await file.text();
//     const object = JSON.parse(contents);

//     const value = object.userInfoObject[key];

//     return Promise.resolve(value);
//   }

//   // eslint-disable-next-line no-unused-vars
//   async remove(key: string): Promise<void> {
//     await this.dirHandle.removeEntry("userInfo.txt");
//   }
// }

abstract class StorageSettings implements ISettingsStorage {
  protected storage: Storage;

  constructor(storage: Storage) {
    this.storage = storage;
  }

  set(key: string, value: any): Promise<void> {
    this.storage.setItem(key, JSON.stringify(value));
    return Promise.resolve();
  }
  get(key: string): Promise<any> {
    const valueJson = this.storage.getItem(key);
    if (valueJson === "") {
      return Promise.resolve("");
    }
    if (valueJson) {
      const retVal = JSON.parse(valueJson);
      return Promise.resolve(retVal);
    }

    return Promise.resolve(null);
  }
  remove(key: string): Promise<void> {
    this.storage.removeItem(key);
    return Promise.resolve();
  }
}

class LocalStorageSettings extends StorageSettings {
  constructor() {
    super(window.localStorage);
  }
}

class SessionStorageSettings extends StorageSettings {
  constructor() {
    super(window.sessionStorage);
  }
}

//TO SECURE --> . https://www.icloud.com/iclouddrive/0pw1tr6bEg2LpkSPYJ5U1awVg#IETSS2014_0029_final-2
class IndexedDBSettings {
  protected db: IDBDatabase;
  private database: string;
  private version: number;

  constructor(database: string) {
    this.database = database;
  }
  async createObjectStore(tableNames: string[], keyPath: any[]): Promise<void> {
    try {
      return new Promise((resolve, reject) => {
        //Create or open the database
        //await this.db.close();
        this.version++;
        var request = indexedDB.open(this.database, this.version);

        request.onblocked = (e) => {
          console.log(e.target);
        };

        //on upgrade needed, create object store
        request.onupgradeneeded = async (e) => {
          this.db = (<IDBOpenDBRequest>e.target).result;
          tableNames.map(async (tableName, i) => {
            await this.db.createObjectStore(tableName, { keyPath: keyPath[i] });
          });
        };

        //on success
        request.onsuccess = (e) => {
          this.db = (<IDBOpenDBRequest>e.target).result;
          this.version = this.db.version;
          resolve();
        };

        //on error
        request.onerror = (e) => {
          console.log((<IDBOpenDBRequest>e.target).error);
          reject();
        };
      });
    } catch (e) {
      console.error(e.message);
      return;
    }
  }

  async open(): Promise<boolean> {
    try {
      //Open database
      //ONLY FOR TESTS
      //await indexedDB.deleteDatabase(this.database);
      var request = indexedDB.open(this.database);

      //on upgrade needed, create object store
      request.onupgradeneeded = async (e) => {
        this.db = (<IDBOpenDBRequest>e.target).result;
        await this.db.createObjectStore("userInfo", { keyPath: "keyName" });
        await this.db.createObjectStore("tablePrimaryKeys", { keyPath: "tableID" });
        await this.db.createObjectStore("tableNames", { keyPath: "tableName" });
        this.version = e.newVersion;
      };

      var dbOpened: boolean = await new Promise((resolve, reject) => {
        //on success
        request.onsuccess = async (e) => {
          this.db = (<IDBOpenDBRequest>e.target).result;
          var onSuccess = true;
          this.version = this.db.version;
          console.log("Database version: " + this.version);
          resolve(onSuccess);
        };

        //on error
        request.onerror = (e) => {
          console.log((<IDBOpenDBRequest>e.target).error);
          reject(false);
        };
      });

      return dbOpened;
    } catch (error) {
      return;
    }
  }

  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.db.close();
        resolve();
      } catch {
        reject();
      }
    });
  }

  async set(tableName: string, record: any): Promise<void> {
    const tx = this.db.transaction(tableName, "readwrite");
    const store = tx.objectStore(tableName);
    store.put(record);
  }

  async get(tableName: string, key: any): Promise<any> {
    var record = await new Promise((resolve, reject) => {
      const tx = this.db.transaction(tableName, "readonly");
      const store = tx.objectStore(tableName);
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });

    return record;
  }

  async count(tableName: string, key?: any): Promise<number> {
    var recordCount: number = await new Promise((resolve, reject) => {
      const tx = this.db.transaction(tableName, "readonly");
      const store = tx.objectStore(tableName);
      const request = store.count(key);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
    return recordCount;
  }

  async remove(tableName: string, key: string): Promise<void> {
    const tx = this.db.transaction(tableName, "readwrite");
    const store = tx.objectStore(tableName);
    const result = await store.get(key);
    if (!result) {
      console.log("Key not found", key);
    }
    await store.delete(key);
    console.log("Data Deleted", key);
    return;
  }
}

const documentSettings: ISettingsStorage = new DocumentSettings();
// eslint-disable-next-line no-unused-vars
const localStorageSettings: ISettingsStorage = new LocalStorageSettings();

const sessionStorageSettings: ISettingsStorage = new SessionStorageSettings();

//const fileSettings: ISettingsStorage = new FileSettings();

class Settings {
  private readonly NAME = "__docSettings";

  async getRefreshToken(): Promise<TokenStr | null> {
    const value = await documentSettings.get(this.NAME);
    return (value && (value["refreshToken"] as TokenStr)) || null;
  }

  async getUser(): Promise<User | null> {
    const value = await documentSettings.get(this.NAME);
    return (value && (value["user"] as User)) || null;
  }

  async setTokenAndUser(token: TokenStr, user: User): Promise<void> {
    const settingObj = (await documentSettings.get(this.NAME)) || {};
    settingObj["refreshToken"] = token;
    settingObj["user"] = user;
    await documentSettings.set(this.NAME, settingObj);
  }

  async removeTokenAndUser(): Promise<void> {
    const settingObj = (await documentSettings.get(this.NAME)) || {};
    delete settingObj["refreshToken"];
    delete settingObj["user"];
    await documentSettings.set(this.NAME, settingObj);
  }
}

class SessionSettings {
  async getRefreshToken(): Promise<TokenStr | null> {
    const value = await sessionStorageSettings.get("refreshToken");
    return (value as TokenStr) || null;
  }

  async getUser(): Promise<User | null> {
    const value = await sessionStorageSettings.get("user");
    return (value as User) || null;
  }

  async setTokenAndUser(token: TokenStr, user: User): Promise<void> {
    await sessionStorageSettings.set("refreshToken", token);
    await sessionStorageSettings.set("user", user);
  }

  async removeTokenAndUser(): Promise<void> {
    await sessionStorageSettings.remove("refreshToken");
    await sessionStorageSettings.remove("user");
  }
}

// class FileStorageSettings {
//   async getRefreshToken(): Promise<TokenStr | null> {
//     const value = await fileSettings.get("refreshToken");
//     return (value as TokenStr) || null;
//   }

//   async getUser(): Promise<User | null> {
//     const value = await fileSettings.get("user");
//     return (value as User) || null;
//   }

//   async setTokenAndUser(token: TokenStr, user: User): Promise<void> {
//     const userInfoObject = {
//       refreshToken: token,
//       user: user,
//     };
//     console.log("set user info");
//     await fileSettings.set("userInfo", userInfoObject);
//   }

//   async removeTokenAndUser(): Promise<void> {
//     await fileSettings.remove("userInfo");
//   }
// }

/*class DiskStorageSettings {

  constructor() {
    openSync("./userInfo.json", 'r', 0o600)
  }

  async getRefreshToken(): Promise<TokenStr | null> {
    try {
      var fileContent = readFileSync("./userInfo.json");
      var value = JSON.parse(fileContent.toString()).user;

      return (value as TokenStr) || null;
    } catch (error) {
      console.log(error);
    }
  }

  async getUser(): Promise<User | null> {
    try {
      var fileContent = readFileSync("./userInfo.json");
      var value = JSON.parse(fileContent.toString()).user;

      return (value as User) || null;
    } catch (error) {
      console.log(error);
    }
  }

  async setTokenAndUser(token: TokenStr, user: User): Promise<void> {
    try {
      const UserInfo = {
        refreshToken: token,
        user: user,
      };
      const data = JSON.stringify(UserInfo);

      writeFileSync("./userInfo.json", data, { mode: 0o600 });
    } catch (error) {
      console.log(error);
    }
  }

  async removeTokenAndUser(): Promise<void> {
    try {
      unlinkSync("./userInfo.json");
    } catch (error) {
      console.log(error);
    }
  }
}*/

export const settings = new Settings();
export const indexedDatabase = new IndexedDBSettings("BaselineDB");
export const sessionSettings = new SessionSettings();
//export const diskStorage = new DiskStorageSettings();
//export const fileStore = new FileStorageSettings();
