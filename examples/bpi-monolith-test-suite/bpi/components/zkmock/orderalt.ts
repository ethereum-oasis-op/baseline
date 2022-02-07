enum Status {
    Opened,
    Accepted,
    Fulfilled
}
export class OrderAlt {

    productId: string;

    buyerSig: string;

    sellerSig: string;

    status: Status;

    constructor(productId: string, buyerSig: string) {
        this.productId = productId;
        this.buyerSig = buyerSig;
        this.status = Status.Opened;
    }

}