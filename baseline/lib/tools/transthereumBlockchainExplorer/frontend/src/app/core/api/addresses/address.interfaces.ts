import { Transaction } from '../transactions/transaction.interfaces';

export interface Address {
    address: string;
    balances: TokenBalance[];
    transactions: Transaction[];
}

export interface TokenBalance {
    address: string;
    name: string;
    symbol: string;
    decimalPlaces: number;
    amount: string;
}
