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

        if (!this.productIdMatches(order)) {
            return false;
        }

        this.orders.push(order);
        return true;
    }

    acceptOrder(order: Order): boolean {
        // TODO: Add workstep logic
            
        if (!this.isOrder(order)) {
            return false;
        }

        if (!this.orderIdMatches(order)) {
            return false;
        }

        if (!this.productIdMatches(order)) {
            return false;
        }

        if (!this.orderPriceIsGreater(order)) {
            return false;
        }

        if (!this.isPendingState(order)) {
            return false;
        }

        // check that previous stat is pending 

        order.setAcceptanceStatus("accepted");
        return true;
    }

    private isOrder(stateObject: Order): boolean {
        return stateObject.type === "Purchase";
    }

    private orderPriceIsGreater(stateObject: Order): boolean {
        return stateObject.price > 23;
    }

    private orderIdMatches(stateObject: Order): boolean {
        const orders = this.orders.filter(order => order.id === stateObject.id);
        return orders.length === 1;
    }

    private productIdMatches(stateObject: Order): boolean {
        return this.productIds.includes(stateObject.productId);

    }

    private isPendingState( stateObject: Order ): boolean {
        return stateObject.acceptanceStatus === "pending";
    }

}