import { Order } from "./order";

export class BpiSubject {
    public id: string;
    public name: string;
    orders: Order[] = [];
    proofForActualWorkstep: string;

    getOrderById(id:string):Order{
        const ords = this.orders.filter(order=>order.id === id);
        
        return ords[0];
    }
}