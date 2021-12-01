export class Order{
    id:string;
    type:string;
    price:number;

    constructor(id:string, type:string, price:number){
        this.id = id;
        this.type= type;
        this.price = price;
    }
}