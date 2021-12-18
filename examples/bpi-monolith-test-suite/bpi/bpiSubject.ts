export class BpiSubject {
    public id: string;
    public name: string;
    nonce: number = 0; // TODO: Introduce accounts and move nonce ther

    getNonce(): number {
        return this.nonce;
    }

    incrementNonce() {
        this.nonce += 1;
    }
}

