import { Order } from "./order";

export class Agreement{

    productIds: string[] = [];

    orders: string[] = [];

    proofs: string[] = [];

    signature: boolean = false;


    isOrder(stateObject: Order ) {
        //return stateObject["type"] === "Order";
        return stateObject.type === "Purchase";
    }

    orderPriceIsGreater(stateObject: Order) {
        //return stateObject["price"] > 23;
        return stateObject.price > 23;
    }

    idsMatch() {
        return this.idCheck();
    }

    private idCheck(){
        return true;
    }

}