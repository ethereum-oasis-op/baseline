export class Agreement{
    isOrder(stateObject: any ) {
        return stateObject["type"] === "Order";
    }

    orderPriceIsGreater(stateObject: any) {
        return stateObject["price"] > 23;
    }

}