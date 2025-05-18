
export type MarketType = "crypto" | "forex" | "commodities";
export type SignalDirection = "buy" | "sell";
export type TimeFrame = "short" | "medium" | "long";
export type SignalStatus = "active" | "completed" | "invalidated";

export interface Market {
  id: string;
  name: string;
  symbol: string;
  type: MarketType;
  currentPrice: number;
  image?: string;
}

export interface PredictionSignal {
  id: string;
  marketId: string;
  marketType: MarketType;
  assetName: string;
  assetSymbol: string;
  direction: SignalDirection;
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  entryTime: string;
  expectedExitTime: string;
  actualExitTime?: string;
  probability: number;
  status: SignalStatus;
  profitPotential: number;
  riskReward: number;
  timeFrame: TimeFrame;
  image?: string;
  result?: "profit" | "loss" | null;
  resultAmount?: number;
}
