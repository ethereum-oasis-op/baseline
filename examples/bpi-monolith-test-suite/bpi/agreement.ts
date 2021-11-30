export class Agreement{

    productIds: string[];

    orders: string[];

    proofs: string[];


    isOrder(stateObject: any ) {
        return stateObject["type"] === "Order";
    }

    orderPriceIsGreater(stateObject: any) {
        return stateObject["price"] > 23;
    }

}