export class Agreement{

    productIds: string[] = [];

    orders: string[] = [];

    proofs: string[] = [];

    signature: boolean = false;


    isOrder(stateObject: any ) {
        return stateObject["type"] === "Order";
    }

    orderPriceIsGreater(stateObject: any) {
        return stateObject["price"] > 23;
    }

    idsMatch() {
        return this.idCheck();
    }

    private idCheck(){
        return true;
    }

}