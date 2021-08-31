// NOTE: Incapsulate working with storages

/* global Office */

import { TokenStr } from "../models/common";
import { User } from "../models/user";
import { Record } from "../models/record";
//import { readFileSync, writeFileSync, unlinkSync, openSync } from "fs";

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

class IndexedDBSettings {
  protected db: IDBDatabase;
  private database: string;
  private version: number;

  constructor(database: string) {
    this.database = database;
  }
  async createObjectStore(tableName: string): Promise<void> {
    try { 
      return new Promise((resolve, reject) => {
      //Create or open the database
      this.version++;
      var request = indexedDB.open(this.database, this.version);

      request.onblocked = (e) => {
        console.log(e.target);
      }
     
      //on upgrade needed, create object store
      request.onupgradeneeded = async (e) => {
        this.db = (<IDBOpenDBRequest>e.target).result;
        await this.db.createObjectStore(tableName+"Out", { keyPath: ["primaryKey", "columnName"] });
        await this.db.createObjectStore(tableName+"In", { keyPath: "baselineID" });
        await this.db.createObjectStore(tableName, { keyPath: "columnName" });
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

    })
    } catch (e) {

      console.error(e.message);
      return;
    }
  }

  async openDB(tableName: string): Promise<unknown> {
    try {
      //Open database
      var request = indexedDB.open(this.database);
      
      //on upgrade needed, create object store
      request.onupgradeneeded = async (e) => {
        this.db = (<IDBOpenDBRequest>e.target).result;
        await this.db.createObjectStore("tablePrimaryKeys", { keyPath: "tableID" });
        await this.db.createObjectStore("tableNames", { keyPath: "tableName" });
        this.version = e.newVersion;
      };

      var tableExists = await new Promise((resolve, reject) => {
        //on success
        request.onsuccess = async (e) => {
          this.db = (<IDBOpenDBRequest>e.target).result;
          var bool = await this.keyExists("tablePrimaryKeys", tableName);
          this.version = this.db.version;
          console.log("Database version: " + this.version);
          resolve(bool);
        };

        //on error
        request.onerror = (e) => {
          console.log((<IDBOpenDBRequest>e.target).error);
          reject(request.error)
        };
      });

      return tableExists;
      
    } catch (error) {
      return;
    }
  }

  closeDB(): Promise<void> {
    return new Promise((resolve, reject) => {

      try{
        this.db.close();
        resolve();
      } catch {
        reject();
      }

    })
  }

  async set(tableName: string, key: string[], value: string): Promise<void> {
    await this.setOutboundTable(tableName, key, value);
    await this.setInboundTable(tableName, value, key);
  }

  async setOutboundTable(tableName: string, key: string[], value: string): Promise<void> {
    const record: Record = {
      primaryKey: key[0],
      columnName: key[1],
      baselineID: value,
    };
    const tx = this.db.transaction(tableName+"Out", "readwrite");
    const store = tx.objectStore(tableName+"Out");
    store.put(record);
  }

  async setInboundTable(tableName: string, key: string, value: string[]): Promise<void> {
    const record: Record = {
      baselineID: key,
      primaryKey: value[0],
      columnName: value[1], 
    };
    const tx = this.db.transaction(tableName+"In", "readwrite");
    const store = tx.objectStore(tableName+"In");
    store.put(record);
  }

  async setPrimaryKey(key: string, value: string): Promise<void> {
    const record = {
      tableID : key,
      primaryKey : value
    }
    const tx = this.db.transaction("tablePrimaryKeys", "readwrite");
    const store = tx.objectStore("tablePrimaryKeys");
    store.put(record);
  }

  async setColumnMapping(tableName: string, key: string, value: string): Promise<void> {
    const record = {
      columnName: key,
      mapping: value,
    };
    const tx = this.db.transaction(tableName, "readwrite");
    const store = tx.objectStore(tableName);
    store.put(record); 
  }

  async getColumnMapping(tableName: string, key: string): Promise<string>{
    var mapping: string = await new Promise((resolve, reject) => {
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

    return mapping; 
  }

  async setTableName(key: string, value: string): Promise<void>{
    
    const record = {
      tableName: key,
      mappingTable: value,
    };
    const tx = this.db.transaction("tableNames", "readwrite");
    const store = tx.objectStore("tableNames");
    store.put(record);  
  }

  async getTableName(key: string): Promise<String> {
    var mapping: string = await new Promise((resolve, reject) => {
      const tx = this.db.transaction("tableNames", "readonly");
      const store = tx.objectStore("tableNames");
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });

    return mapping;  
  }

  async get(tableName: string, key: string[]): Promise<string> {
    var record: Record = await new Promise((resolve, reject) => {
      const tx = this.db.transaction(tableName+"Out", "readonly");
      const store = tx.objectStore(tableName+"Out");
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });

    return record.baselineID;
  }

  async getKey(tableName: string, key: string): Promise<any> {
    var record: Record = await new Promise((resolve, reject) => {
      const tx = this.db.transaction(tableName+"In", "readonly");
      const store = tx.objectStore(tableName+"In");
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });

    return [record.primaryKey, record.columnName];
  }

  async getPrimaryKeyField(key: string) : Promise<any> {
    var record = await new Promise((resolve, reject) => {
      const tx = this.db.transaction("tablePrimaryKeys", "readonly"); 
      const store = tx.objectStore("tablePrimaryKeys");
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.log(request.error);
        reject(request.error);
      };
    });
  
    return record["primaryKey"]; 
  }

  async tableExists(tableName: string): Promise<boolean> {
   return await this.keyExists("tableNames", tableName);
  }

  async keyExists(tableName: string, key: any, source?: string) : Promise<boolean> {
    //Switch
    switch(source){
      case "In":
        tableName = tableName+"In";
        break;
      case "Out":
        tableName = tableName+"Out";
        break;
      default:
        tableName;
    }
    return await this.checkRecord(tableName, key);
  }

  private async checkRecord(tableName: string, key?: any) : Promise<boolean> {
  
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

    if (recordCount > 0) {
      return true;
    } else {
      return false;
    }

  }

  async remove(tableName: string, key: string[]): Promise<void> {
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
