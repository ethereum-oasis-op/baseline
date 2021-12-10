export class Order {
    id: string;
    type: string;
    price: number;
    productId: string;
    acceptanceStatus: string = "pending";

    constructor(id: string, type: string, price: number, productId: string) {
        this.id = id;
        this.type = type;
        this.price = price;
        this.productId = productId;
    }

    setAcceptanceStatus(status: string) {
        this.acceptanceStatus = status;
    }
}