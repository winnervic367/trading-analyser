import React, { useEffect, useState } from "react";
import { MarketType, PredictionSignal, TimeFrame } from "@/types/market";
import { fetchFilteredSignals } from "@/services/signalService";
import { formatPrice, formatPercentage } from "@/utils/formatters";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, MessageCircle, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PriceChart from "@/components/PriceChart";

interface SignalsTableProps {
  marketType: MarketType;
  timeFrame: TimeFrame;
  onSelectSignal: (id: string) => void;
}

const SignalsTable: React.FC<SignalsTableProps> = ({
  marketType,
  timeFrame,
  onSelectSignal,
}) => {
  const [signals, setSignals] = useState<PredictionSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSignalForChart, setSelectedSignalForChart] = useState<PredictionSignal | null>(null);
  const [filter, setFilter] = useState<"all" | "win" | "loss">("all");

  useEffect(() => {
    const loadSignals = async () => {
      setLoading(true);
      try {
        const data = await fetchFilteredSignals(marketType, timeFrame);
        setSignals(data);
      } catch (error) {
        console.error("Error loading signals:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSignals();
  }, [marketType, timeFrame]);

  const filteredSignals = signals.filter(signal => {
    if (filter === "all") return true;
    if (filter === "win") return signal.result === "profit";
    if (filter === "loss") return signal.result === "loss";
    return true;
  });

  const handleShare = (signal: PredictionSignal, platform: "telegram" | "whatsapp") => {
    const message = `🔮 AI Trade Signal
Market: ${signal.marketType.charAt(0).toUpperCase() + signal.marketType.slice(1)}
Pair: ${signal.assetSymbol}
Entry: ${formatPrice(signal.entryPrice)}
Exit: ${formatPrice(signal.targetPrice)}
Entry Time: ${format(new Date(signal.entryTime), "MMM dd, yyyy HH:mm")} UTC
Confidence: ${signal.probability}%
Risk/Reward: ${signal.riskReward}
Direction: ${signal.direction.toUpperCase()}
View Chart 📊 [${window.location.origin}/signals/${signal.id}]`;

    let url = "";
    if (platform === "telegram") {
      url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(message)}`;
    } else if (platform === "whatsapp") {
      url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    }

    window.open(url, "_blank");
    toast({
      title: "Share Link Created",
      description: `Signal shared via ${platform === "whatsapp" ? "WhatsApp" : "Telegram"}`,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card rounded-lg border border-border">
        <div className="p-4 border-b border-border">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Trading Signals</h3>
            <div className="flex gap-2">
              <Badge 
                variant={filter === "all" ? "default" : "outline"} 
                className="cursor-pointer"
                onClick={() => setFilter("all")}
              >
                All
              </Badge>
              <Badge 
                variant={filter === "win" ? "default" : "outline"} 
                className="cursor-pointer"
                onClick={() => setFilter("win")}
              >
                Win
              </Badge>
              <Badge 
                variant={filter === "loss" ? "default" : "outline"} 
                className="cursor-pointer"
                onClick={() => setFilter("loss")}
              >
                Loss
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Market Type</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>Entry Price</TableHead>
                <TableHead>Exit Price</TableHead>
                <TableHead>Entry Time</TableHead>
                <TableHead>Exit Time</TableHead>
                <TableHead>Probability</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Chart</TableHead>
                <TableHead>Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSignals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8">
                    No signals found for the selected filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredSignals.map((signal) => (
                  <TableRow key={signal.id} onClick={() => onSelectSignal(signal.id)} className="cursor-pointer hover:bg-accent/10">
                    <TableCell className="whitespace-nowrap">
                      {signal.marketType === "crypto" ? "Crypto" : 
                       signal.marketType === "forex" ? "Forex" : "Commodities"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {signal.image && (
                          <img src={signal.image} alt={signal.assetSymbol} className="h-5 w-5" />
                        )}
                        {signal.assetSymbol}
                      </div>
                    </TableCell>
                    <TableCell>
                      {signal.direction === "buy" ? (
                        <span className="flex items-center text-green-500">
                          <ArrowUp className="h-4 w-4 mr-1" /> Buy
                        </span>
                      ) : (
                        <span className="flex items-center text-red-500">
                          <ArrowDown className="h-4 w-4 mr-1" /> Sell
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{formatPrice(signal.entryPrice)}</TableCell>
                    <TableCell>{formatPrice(signal.targetPrice)}</TableCell>
                    <TableCell className="whitespace-nowrap">{format(new Date(signal.entryTime), "MMM dd, HH:mm")}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {signal.actualExitTime ? 
                        format(new Date(signal.actualExitTime), "MMM dd, HH:mm") : 
                        format(new Date(signal.expectedExitTime), "MMM dd, HH:mm")}
                    </TableCell>
                    <TableCell>
                      <span className={signal.probability > 75 ? "text-green-500" : "text-amber-500"}>
                        {signal.probability}%
                      </span>
                    </TableCell>
                    <TableCell>
                      {signal.status === "active" ? (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                          Active
                        </Badge>
                      ) : signal.result === "profit" ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          Win
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                          Loss
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs h-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSignalForChart(signal);
                            }}
                          >
                            View Chart
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>
                              {signal.assetName} ({signal.assetSymbol}) Chart Analysis
                            </DialogTitle>
                          </DialogHeader>
                          <div className="py-4">
                            <div className="mb-4">
                              <div className="grid grid-cols-3 gap-3 mb-4">
                                <div className="p-2 bg-red-500/10 rounded-md text-center">
                                  <p className="text-muted-foreground text-xs">Stop Loss</p>
                                  <p className="font-medium">{formatPrice(signal.stopLoss)}</p>
                                </div>
                                <div className="p-2 bg-blue-500/10 rounded-md text-center">
                                  <p className="text-muted-foreground text-xs">Entry</p>
                                  <p className="font-medium">{formatPrice(signal.entryPrice)}</p>
                                </div>
                                <div className="p-2 bg-green-500/10 rounded-md text-center">
                                  <p className="text-muted-foreground text-xs">Target</p>
                                  <p className="font-medium">{formatPrice(signal.targetPrice)}</p>
                                </div>
                              </div>
                              <PriceChart 
                                cryptoId={signal.marketId}
                                days={signal.timeFrame === "short" ? 1 : signal.timeFrame === "medium" ? 7 : 30}
                                height={300}
                              />
                            </div>
                            <div className="mt-3">
                              <h4 className="font-medium mb-1">AI Analysis</h4>
                              <p className="text-sm text-muted-foreground">
                                {generateAnalysisText(signal)}
                              </p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(signal, "telegram");
                          }}
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(signal, "whatsapp");
                          }}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

// Generate analysis text based on signal data
const generateAnalysisText = (signal: PredictionSignal): string => {
  const directionText = signal.direction === "buy" ? "bullish" : "bearish";
  const timeframeText = 
    signal.timeFrame === "short" ? "short-term" : 
    signal.timeFrame === "medium" ? "medium-term" : "long-term";
  
  let analysis = '';
  
  if (signal.marketType === "crypto") {
    analysis = `Our AI algorithm has detected a strong ${directionText} pattern for ${signal.assetName} with ${signal.probability}% confidence. Technical indicators including RSI, MACD, and Bollinger Bands suggest a ${timeframeText} ${directionText} movement. The target price of ${formatPrice(signal.targetPrice)} represents a potential ${formatPercentage(signal.profitPotential)} move from the entry point. The risk/reward ratio of ${signal.riskReward} indicates a favorable trading opportunity.`;
  } else if (signal.marketType === "forex") {
    analysis = `Based on advanced analysis of technical indicators, market sentiment, and historical patterns, our AI predicts a ${directionText} movement for ${signal.assetSymbol} with ${signal.probability}% confidence. The ${timeframeText} outlook suggests momentum toward the target price of ${formatPrice(signal.targetPrice)}, with key support at ${formatPrice(signal.stopLoss)}. Economic data releases and central bank policies have been factored into this prediction.`;
  } else {
    analysis = `AI analysis of supply/demand dynamics, market sentiment, and technical indicators reveals a ${directionText} opportunity for ${signal.assetName}. Historical price patterns suggest the ${timeframeText} target of ${formatPrice(signal.targetPrice)} is achievable with ${signal.probability}% probability. Current market fundamentals and seasonal trends support this prediction.`;
  }
  
  if (signal.status === "active") {
    analysis += ` Monitor this signal closely as the market approaches key resistance/support levels.`;
  } else if (signal.status === "completed" && signal.result) {
    if (signal.result === "profit") {
      analysis += ` This prediction was successful, resulting in a ${formatPercentage(signal.resultAmount || 0)} profit when the target was reached.`;
    } else {
      analysis += ` This prediction was not successful, resulting in a ${formatPercentage(Math.abs(signal.resultAmount || 0))} loss when the stop loss was triggered.`;
    }
  }
  
  return analysis;
};

export default SignalsTable;
