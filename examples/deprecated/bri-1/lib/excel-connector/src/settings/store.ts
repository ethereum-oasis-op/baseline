import { Record } from "src/models/record";
import { indexedDatabase as db } from "./settings";
import { TokenStr } from "src/models/common";
import { User } from "src/models/user";
import { crypto } from "./crypto";
import { alerts } from "../common/alerts";
export class Store {
  onDbOpen = false;

  async open(): Promise<void> {
    //Open DB and create tables
    this.onDbOpen = await db.open();
  }
  async close(): Promise<void> {
    await db.close();
  }

  async createTables(tableName: string, keypath: string) {
    await db.createObjectStore([tableName], [keypath]);
  }

  async set(tableName, keyPath: string, key: string, value: any) {
    const record = {};
    record[keyPath] = key;
    record["value"] = value;

    await db.set(tableName, record);
  }

  async get(tableName, key): Promise<any> {
    const value = await db.get(tableName, key);
    return value;
  }

  async createInboundAndOutboundTables(tableName: string): Promise<void> {
    const tableNames = [tableName + "Out", tableName + "In", tableName];
    const keyPaths = [["primaryKey", "columnName"], "baselineID", "columnName"];

    await db.createObjectStore(tableNames, keyPaths);
  }

  async setInboundAndOutboundTables(tableName: string, key: string[], value: string): Promise<void> {
    await this.setInboundTable(tableName, value, key);
    await this.setOutboundTable(tableName, key, value);
  }

  async setInboundTable(tableName: string, key: string, value: string[]): Promise<void> {
    const record: Record = {
      baselineID: key,
      primaryKey: value[0],
      columnName: value[1],
    };

    tableName = tableName + "In";
    await db.set(tableName, record);
  }

  async setOutboundTable(tableName: string, key: string[], value: string): Promise<void> {
    const record: Record = {
      primaryKey: key[0],
      columnName: key[1],
      baselineID: value,
    };

    tableName = tableName + "Out";
    await db.set(tableName, record);
  }

  async setPrimaryKey(key: string, value: string): Promise<void> {
    const record = {
      tableID: key,
      primaryKey: value,
    };

    const tableName = "tablePrimaryKeys";
    await db.set(tableName, record);
  }

  async setColumnMapping(tableName: string, key: string, value: string): Promise<void> {
    const record = {
      columnName: key,
      mapping: value,
    };

    await db.set(tableName, record);
  }

  async setTableName(key: string, value: string): Promise<void> {
    const record = {
      tableName: key,
      mappingTable: value,
    };

    const tableName = "tableNames";
    await db.set(tableName, record);
  }

  async getTableName(key: string): Promise<String> {
    var tableName: string = await db.get("tableNames", key);
    return tableName;
  }

  async getBaselineId(tableName: string, key: string[]): Promise<string> {
    tableName = tableName + "Out";
    var record: Record = await db.get(tableName, key);

    return record.baselineID;
  }

  async getPrimaryKeyId(tableName: string, key: string): Promise<any> {
    tableName = tableName + "In";
    var record: Record = await db.get(tableName, key);

    return [record.primaryKey, record.columnName];
  }

  async getPrimaryKeyField(key: string): Promise<any> {
    const tableName = "tablePrimaryKeys";
    var record = await db.get(tableName, key);

    return record["primaryKey"];
  }

  async getColumnMapping(tableName: string, key: string): Promise<string> {
    var columnMapping: string = await db.get(tableName, key);
    return columnMapping["mapping"];
  }

  async tableExists(dbObjectStoreName: string, tableName: string): Promise<boolean> {
    var tableExists = false;
    if (this.onDbOpen) {
      tableExists = await this.keyExists(dbObjectStoreName, tableName);
    }
    return tableExists;
  }

  async keyExists(tableName: string, key: any, source?: string): Promise<boolean> {
    //Switch
    switch (source) {
      case "In":
        tableName = tableName + "In";
        break;
      case "Out":
        tableName = tableName + "Out";
        break;
      default:
        tableName;
    }
    return await this.checkRecord(tableName, key);
  }

  private async checkRecord(tableName: string, key?: any): Promise<boolean> {
    var recordCount: number = await db.count(tableName, key);
    if (recordCount > 0) {
      return true;
    } else {
      return false;
    }
  }

  async remove(tableName: string, key: string): Promise<void> {
    await db.remove(tableName, key);
  }

  async getRefreshToken(): Promise<TokenStr | null> {
    try {
      if (this.onDbOpen) {
        const encryptedUserInfo = await this.get("userInfo", "userInfo");
        const decryptedUserInfo: string = await crypto.decrypt(encryptedUserInfo);
        const value = JSON.parse(decryptedUserInfo).refreshToken;
        return (value as TokenStr) || null;
      }
      return null;
    } catch (e) {
      alerts.error(e);
    }
  }

  async getUser(): Promise<User | null> {
    try {
      if (this.onDbOpen) {
        const encryptedUserInfo = await this.get("userInfo", "userInfo");
        const decryptedUserInfo: string = await crypto.decrypt(encryptedUserInfo);
        const value = JSON.parse(decryptedUserInfo).user;
        return (value as User) || null;
      }
      return null;
    } catch (e) {
      alerts.error(e);
    }
  }

  async setTokenAndUser(token: TokenStr, user: User): Promise<void> {
    var userInfo = {
      refreshToken: token,
      user: user,
    };

    await crypto.setKey();
    var encryptedUserInfo = await crypto.encrypt(JSON.stringify(userInfo));
    await this.set("userInfo", "keyName", "userInfo", encryptedUserInfo);
  }

  async removeTokenAndUser(): Promise<void> {
    await store.remove("userInfo", "userInfo");
    await store.remove("userInfo", "cryptoKey");
    await store.remove("userInfo", "cryptoIv");
  }
}

export const store = new Store();
