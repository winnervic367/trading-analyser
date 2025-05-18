
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketType, PredictionSignal, TimeFrame } from "@/types/market";
import { fetchFilteredSignals, startRealtimeUpdates, stopRealtimeUpdates } from "@/services/signalService";
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown } from "lucide-react";
import { CryptoCurrency } from "@/services/cryptoService";

interface SignalsListProps {
  marketType: MarketType;
  timeFrame: TimeFrame;
  onSelectSignal: (id: string) => void;
  selectedSignalId: string | null;
  onSelectAsset: (asset: CryptoCurrency) => void;
}

const SignalsList: React.FC<SignalsListProps> = ({
  marketType,
  timeFrame,
  onSelectSignal,
  selectedSignalId,
  onSelectAsset,
}) => {
  const [signals, setSignals] = useState<PredictionSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  useEffect(() => {
    const loadSignals = async () => {
      setLoading(true);
      try {
        const data = await fetchFilteredSignals(marketType, timeFrame);
        setSignals(data);
        
        // Select the first signal by default if none is selected
        if (data.length > 0 && !selectedSignalId) {
          onSelectSignal(data[0].id);
          if (marketType === "crypto" && data[0].marketId) {
            onSelectAsset({
              id: data[0].marketId,
              symbol: data[0].assetSymbol.toLowerCase(),
              name: data[0].assetName,
              image: data[0].image || "",
              current_price: data[0].entryPrice,
              market_cap: 0,
              market_cap_rank: 0,
              price_change_percentage_24h: 0,
            });
          }
        }
      } catch (error) {
        console.error("Error loading signals:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSignals();
    
    // Start real-time price updates
    startRealtimeUpdates();
    
    return () => {
      // Clean up interval on unmount
      stopRealtimeUpdates();
    };
  }, [marketType, timeFrame, onSelectSignal, selectedSignalId, onSelectAsset]);

  const filteredSignals = signals.filter(signal => {
    if (filter === "all") return true;
    if (filter === "active") return signal.status === "active";
    return signal.status === "completed";
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trading Signals</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Trading Signals</CardTitle>
        <div className="flex gap-2 mt-2">
          <Badge 
            variant={filter === "all" ? "default" : "outline"} 
            className="cursor-pointer"
            onClick={() => setFilter("all")}
          >
            All
          </Badge>
          <Badge 
            variant={filter === "active" ? "default" : "outline"} 
            className="cursor-pointer"
            onClick={() => setFilter("active")}
          >
            Active
          </Badge>
          <Badge 
            variant={filter === "completed" ? "default" : "outline"} 
            className="cursor-pointer"
            onClick={() => setFilter("completed")}
          >
            Completed
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {filteredSignals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No signals found for the selected filters
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSignals.map((signal) => (
              <div
                key={signal.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedSignalId === signal.id
                    ? "bg-accent"
                    : "hover:bg-muted"
                }`}
                onClick={() => {
                  onSelectSignal(signal.id);
                  if (marketType === "crypto") {
                    onSelectAsset({
                      id: signal.marketId,
                      symbol: signal.assetSymbol.toLowerCase(),
                      name: signal.assetName,
                      image: signal.image || "",
                      current_price: signal.entryPrice,
                      market_cap: 0,
                      market_cap_rank: 0,
                      price_change_percentage_24h: 0,
                    });
                  }
                }}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    {signal.image && (
                      <img src={signal.image} alt={signal.assetName} className="h-5 w-5" />
                    )}
                    <span className="font-medium">{signal.assetSymbol}</span>
                  </div>
                  <SignalStatusBadge status={signal.status} result={signal.result} />
                </div>
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <div>
                    {signal.direction === "buy" ? (
                      <span className="flex items-center text-green-500">
                        <ArrowUp className="h-3 w-3 mr-1" /> Buy
                      </span>
                    ) : (
                      <span className="flex items-center text-red-500">
                        <ArrowDown className="h-3 w-3 mr-1" /> Sell
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">Prob:</span>
                    <span className={signal.probability > 75 ? "text-green-500" : "text-amber-500"}>
                      {signal.probability}%
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between mt-2 text-xs">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Entry</span>
                    <span>{formatPrice(signal.entryPrice, signal.marketType)}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-muted-foreground">Target</span>
                    <span>{formatPrice(signal.targetPrice, signal.marketType)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const SignalStatusBadge = ({ status, result }: { status: string, result?: string | null }) => {
  if (status === "active") {
    return (
      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
        Active
      </Badge>
    );
  }
  
  if (result === "profit") {
    return (
      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
        Profit
      </Badge>
    );
  }
  
  if (result === "loss") {
    return (
      <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
        Loss
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="bg-muted text-muted-foreground">
      Completed
    </Badge>
  );
};

const formatPrice = (price: number, marketType: MarketType): string => {
  if (marketType === "forex") {
    return price.toFixed(4);
  } else if (marketType === "crypto") {
    return price > 100 ? price.toFixed(2) : price.toFixed(4);
  } else {
    return price.toFixed(2);
  }
};

export default SignalsList;
