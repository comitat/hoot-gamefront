export enum Currency {
    HOOT = 'HOOT',
    USDT = 'USDT',
    TON = 'TON',
    USD = 'USD',
}

export interface PricePair {
    price: string; // "0.6406464501528473"
    tokenFrom: Currency;
    tokenTo: Currency;
    updatedAt: string;
}