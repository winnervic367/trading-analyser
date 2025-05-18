
import { CryptoCurrency } from "./cryptoService";
import { Market, MarketType, PredictionSignal, SignalDirection, SignalStatus, TimeFrame } from "@/types/market";

// Mock data for various market types
const cryptoMarkets: Market[] = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC/USDT", type: "crypto", currentPrice: 62453.12, image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH/USDT", type: "crypto", currentPrice: 3124.87, image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png" },
  { id: "solana", name: "Solana", symbol: "SOL/USDT", type: "crypto", currentPrice: 143.26, image: "https://assets.coingecko.com/coins/images/4128/large/solana.png" },
  { id: "cardano", name: "Cardano", symbol: "ADA/USDT", type: "crypto", currentPrice: 0.457, image: "https://assets.coingecko.com/coins/images/975/large/cardano.png" },
  { id: "binancecoin", name: "BNB", symbol: "BNB/USDT", type: "crypto", currentPrice: 567.32, image: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png" },
];

const forexMarkets: Market[] = [
  { id: "eurusd", name: "EUR/USD", symbol: "EUR/USD", type: "forex", currentPrice: 1.0892 },
  { id: "gbpusd", name: "GBP/USD", symbol: "GBP/USD", type: "forex", currentPrice: 1.2734 },
  { id: "usdjpy", name: "USD/JPY", symbol: "USD/JPY", type: "forex", currentPrice: 155.75 },
  { id: "audusd", name: "AUD/USD", symbol: "AUD/USD", type: "forex", currentPrice: 0.6615 },
  { id: "usdcad", name: "USD/CAD", symbol: "USD/CAD", type: "forex", currentPrice: 1.3642 },
];

const commodityMarkets: Market[] = [
  { id: "gold", name: "Gold", symbol: "XAU/USD", type: "commodities", currentPrice: 2337.45 },
  { id: "silver", name: "Silver", symbol: "XAG/USD", type: "commodities", currentPrice: 27.32 },
  { id: "oil", name: "Crude Oil", symbol: "CL/USD", type: "commodities", currentPrice: 78.45 },
  { id: "natgas", name: "Natural Gas", symbol: "NG/USD", type: "commodities", currentPrice: 1.94 },
  { id: "copper", name: "Copper", symbol: "HG/USD", type: "commodities", currentPrice: 4.22 },
];

// Combine all markets
const allMarkets: { [key in MarketType]: Market[] } = {
  crypto: cryptoMarkets,
  forex: forexMarkets,
  commodities: commodityMarkets
};

// Mock generated signals
const generateMockSignals = (): PredictionSignal[] => {
  const signals: PredictionSignal[] = [];
  const now = new Date();
  let id = 1;

  // Generate signals for each market type
  Object.entries(allMarkets).forEach(([marketType, markets]) => {
    markets.forEach(market => {
      // Generate some completed signals
      for (let i = 0; i < 2; i++) {
        const direction: SignalDirection = Math.random() > 0.5 ? "buy" : "sell";
        const entryPrice = market.currentPrice * (1 + (Math.random() * 0.1 - 0.05));
        const targetPrice = direction === "buy" 
          ? entryPrice * (1 + Math.random() * 0.1) 
          : entryPrice * (1 - Math.random() * 0.1);
        const stopLoss = direction === "buy" 
          ? entryPrice * (1 - Math.random() * 0.05) 
          : entryPrice * (1 + Math.random() * 0.05);
        const profitPotential = Math.abs(targetPrice - entryPrice) / entryPrice * 100;
        const riskReward = Math.abs(targetPrice - entryPrice) / Math.abs(stopLoss - entryPrice);
        
        // Past dates for completed signals
        const pastDays = Math.floor(Math.random() * 5) + 1;
        const entryDate = new Date(now);
        entryDate.setDate(now.getDate() - pastDays);
        
        const exitDate = new Date(entryDate);
        exitDate.setHours(entryDate.getHours() + Math.floor(Math.random() * 24) + 4);
        
        const isProfit = Math.random() > 0.4;
        
        signals.push({
          id: id.toString(),
          marketId: market.id,
          marketType: marketType as MarketType,
          assetName: market.name,
          assetSymbol: market.symbol,
          direction,
          entryPrice,
          targetPrice,
          stopLoss,
          entryTime: entryDate.toISOString(),
          expectedExitTime: exitDate.toISOString(),
          actualExitTime: exitDate.toISOString(),
          probability: Math.floor(Math.random() * 20) + 70,
          status: "completed",
          profitPotential,
          riskReward: parseFloat(riskReward.toFixed(2)),
          timeFrame: i % 3 === 0 ? "short" : i % 3 === 1 ? "medium" : "long",
          image: market.image,
          result: isProfit ? "profit" : "loss",
          resultAmount: isProfit ? profitPotential : -Math.random() * profitPotential,
        });
        
        id++;
      }
      
      // Generate active signals
      const direction: SignalDirection = Math.random() > 0.5 ? "buy" : "sell";
      const entryPrice = market.currentPrice;
      const targetPrice = direction === "buy" 
        ? entryPrice * (1 + Math.random() * 0.1) 
        : entryPrice * (1 - Math.random() * 0.1);
      const stopLoss = direction === "buy" 
        ? entryPrice * (1 - Math.random() * 0.05) 
        : entryPrice * (1 + Math.random() * 0.05);
      const profitPotential = Math.abs(targetPrice - entryPrice) / entryPrice * 100;
      const riskReward = Math.abs(targetPrice - entryPrice) / Math.abs(stopLoss - entryPrice);
      
      // Future exit time
      const exitDate = new Date(now);
      exitDate.setHours(now.getHours() + Math.floor(Math.random() * 48) + 6);
      
      signals.push({
        id: id.toString(),
        marketId: market.id,
        marketType: marketType as MarketType,
        assetName: market.name,
        assetSymbol: market.symbol,
        direction,
        entryPrice,
        targetPrice,
        stopLoss,
        entryTime: now.toISOString(),
        expectedExitTime: exitDate.toISOString(),
        probability: Math.floor(Math.random() * 20) + 70,
        status: "active",
        profitPotential,
        riskReward: parseFloat(riskReward.toFixed(2)),
        timeFrame: id % 3 === 0 ? "short" : id % 3 === 1 ? "medium" : "long",
        image: market.image,
      });
      
      id++;
    });
  });

  return signals;
};

// Cached signals
let cachedSignals: PredictionSignal[] | null = null;

// Fetch all prediction signals
export const fetchSignals = async (): Promise<PredictionSignal[]> => {
  // In a real app, this would be an API call
  if (!cachedSignals) {
    cachedSignals = generateMockSignals();
  }
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(cachedSignals || []);
    }, 500); // Simulate network delay
  });
};

// Filter signals by market type and time frame
export const fetchFilteredSignals = async (
  marketType: MarketType,
  timeFrame?: TimeFrame
): Promise<PredictionSignal[]> => {
  const signals = await fetchSignals();
  
  return signals.filter(signal => 
    signal.marketType === marketType && 
    (timeFrame ? signal.timeFrame === timeFrame : true)
  );
};

// Get signal by ID
export const fetchSignalById = async (id: string): Promise<PredictionSignal | null> => {
  const signals = await fetchSignals();
  return signals.find(signal => signal.id === id) || null;
};

// Get markets by type
export const fetchMarketsByType = async (type: MarketType): Promise<Market[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(allMarkets[type] || []);
    }, 300);
  });
};

// Update market prices with real-time changes to simulate real-time updates
export const updateMarketPrices = (): void => {
  Object.values(allMarkets).forEach(markets => {
    markets.forEach(market => {
      // Update price with small random change (±0.5%)
      const changePercent = (Math.random() * 1) - 0.5;
      market.currentPrice *= (1 + changePercent / 100);
      // Round to appropriate decimal places
      if (market.currentPrice > 1000) {
        market.currentPrice = parseFloat(market.currentPrice.toFixed(2));
      } else if (market.currentPrice > 100) {
        market.currentPrice = parseFloat(market.currentPrice.toFixed(3));
      } else if (market.currentPrice > 1) {
        market.currentPrice = parseFloat(market.currentPrice.toFixed(4));
      } else {
        market.currentPrice = parseFloat(market.currentPrice.toFixed(6));
      }
    });
  });
  
  // Update signals with new prices if they're active
  if (cachedSignals) {
    cachedSignals.forEach(signal => {
      if (signal.status === "active") {
        const market = allMarkets[signal.marketType].find(m => m.id === signal.marketId);
        if (market) {
          // Check if target or stop loss is hit
          if (signal.direction === "buy") {
            if (market.currentPrice >= signal.targetPrice) {
              signal.status = "completed";
              signal.actualExitTime = new Date().toISOString();
              signal.result = "profit";
              signal.resultAmount = signal.profitPotential;
            } else if (market.currentPrice <= signal.stopLoss) {
              signal.status = "completed";
              signal.actualExitTime = new Date().toISOString();
              signal.result = "loss";
              signal.resultAmount = -Math.abs(((signal.entryPrice - signal.stopLoss) / signal.entryPrice) * 100);
            }
          } else { // sell direction
            if (market.currentPrice <= signal.targetPrice) {
              signal.status = "completed";
              signal.actualExitTime = new Date().toISOString();
              signal.result = "profit";
              signal.resultAmount = signal.profitPotential;
            } else if (market.currentPrice >= signal.stopLoss) {
              signal.status = "completed";
              signal.actualExitTime = new Date().toISOString();
              signal.result = "loss";
              signal.resultAmount = -Math.abs(((signal.stopLoss - signal.entryPrice) / signal.entryPrice) * 100);
            }
          }
        }
      }
    });
  }
};

// Initialize real-time price updates
let updateInterval: number | null = null;

export const startRealtimeUpdates = (): void => {
  if (updateInterval === null) {
    updateInterval = window.setInterval(() => {
      updateMarketPrices();
    }, 5000); // Update every 5 seconds
  }
};

export const stopRealtimeUpdates = (): void => {
  if (updateInterval !== null) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
};

// For API key storage
export const saveApiCredentials = (key: string, secret: string): void => {
  localStorage.setItem('tradingApiKey', key);
  localStorage.setItem('tradingApiSecret', secret);
};

export const getApiCredentials = (): { key: string | null, secret: string | null } => {
  return {
    key: localStorage.getItem('tradingApiKey'),
    secret: localStorage.getItem('tradingApiSecret')
  };
};
