// TODO - Create pipe instead
export function applyDecimals(balance: string, decimalPlaces: number) {
    const decimalPosition = balance.length - decimalPlaces;
    return  balance.slice(0, decimalPosition) + '.' + balance.slice(decimalPosition, balance.length);
}
