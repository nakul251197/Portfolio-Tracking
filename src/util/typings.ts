export enum Action {
    BUY = "BUY",
    SELL = "SELL"
}

export interface TradeRequest {
    tickerSymbol: string;
    action: Action;
    price: number;
    quantity: number;
}

