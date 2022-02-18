import { store } from "./store";

export class CryptoKeys {
  //Create Keys
  async generateKey() {
    const result = await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      false,
      ["encrypt", "decrypt"]
    );

    return result;
  }
  //Set Keys
  async setKey() {
    const key = await this.generateKey();
    store.set("userInfo", "keyName", "cryptoKey", key);
  }

  //Get Keys
  async getKey(): Promise<CryptoKey> {
    const key = await store.get("userInfo", "cryptoKey");
    return key.value;
  }

  //Encrypt
  async encrypt(data: string): Promise<ArrayBuffer> {
    const key = await this.getKey();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    await store.set("userInfo", "keyName", "cryptoIv", iv);
    var encodedData = await this.encodeData(data);
    return await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      encodedData
    );
  }

  //Decrypt
  async decrypt(encryptedData: ArrayBuffer): Promise<string> {
    const key = await this.getKey();
    const iv: Uint8Array = await store.get("userInfo", "cryptoIv");
    const decryptedData = <ArrayBuffer>await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      encryptedData
    );
    const decodedData = await this.decodeData(decryptedData);
    return decodedData;
  }

  private async encodeData(data: string): Promise<Uint8Array> {
    let enc = new TextEncoder();
    return enc.encode(data);
  }

  private async decodeData(data: ArrayBuffer): Promise<string> {
    let dec = new TextDecoder();
    return dec.decode(data);
  }
}

export const crypto = new CryptoKeys();
