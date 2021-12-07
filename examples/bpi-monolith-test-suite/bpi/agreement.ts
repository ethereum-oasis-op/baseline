import { Order } from "../domain-objects/order";

export class Agreement {
    productIds: string[] = [];
    orders: Order[] = [];
    proofs: string[] = [];
    signature: boolean = false;

    addOrder(order: Order): boolean {
        if (!this.isOrder(order)) {
            return false;
        }

        if (!this.orderPriceIsGreater(order)) {
            return false;
        }

        if (!this.idsMatch()) {
            return false;
        }

        // TODO: Produce prooof

        this.orders.push(order);
        return true;
    }

    acceptOrder(orderId: string): boolean {
        // TODO: Add workstep logic
        return true;
    }


    private isOrder(stateObject: Order): boolean {
        return stateObject.type === "Purchase";
    }

    private orderPriceIsGreater(stateObject: Order): boolean {
        return stateObject.price > 23;
    }

    private idsMatch(): boolean {
        return this.idCheck();
    }

    private idCheck() {
        return true;
    }

}