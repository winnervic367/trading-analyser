
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketType, PredictionSignal } from "@/types/market";
import { fetchSignalById } from "@/services/signalService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PriceChart from "@/components/PriceChart";
import { ArrowUp, ArrowDown, Share2 } from "lucide-react";
import { formatPrice, formatPercentage } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

interface SignalDetailsProps {
  signalId: string | null;
  assetId: string;
  marketType: MarketType;
}

const SignalDetails: React.FC<SignalDetailsProps> = ({ signalId, assetId, marketType }) => {
  const [signal, setSignal] = useState<PredictionSignal | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"analysis" | "chart">("analysis");

  useEffect(() => {
    const loadSignal = async () => {
      if (!signalId) return;
      
      setLoading(true);
      try {
        const data = await fetchSignalById(signalId);
        setSignal(data);
      } catch (error) {
        console.error("Error loading signal:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSignal();
  }, [signalId]);

  const handleShare = (platform: "whatsapp" | "telegram") => {
    if (!signal) return;

    const message = `${signal.direction === "buy" ? "BUY" : "SELL"} Signal for ${signal.assetName} (${signal.assetSymbol}) | Entry: ${formatPrice(signal.entryPrice)} | Target: ${formatPrice(signal.targetPrice)} | Stop Loss: ${formatPrice(signal.stopLoss)} | Probability: ${signal.probability}% | Risk/Reward: ${signal.riskReward} | TradeMind AI`;

    let url = "";
    if (platform === "whatsapp") {
      url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    } else if (platform === "telegram") {
      url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(message)}`;
    }

    window.open(url, "_blank");
    toast({
      title: "Share Link Copied",
      description: `Signal shared via ${platform === "whatsapp" ? "WhatsApp" : "Telegram"}`,
    });
  };

  if (loading || !signal) {
    return (
      <Card className="h-[500px]">
        <CardHeader>
          <CardTitle>AI Signal Analysis</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="flex items-center gap-2">
            {signal.image && (
              <img src={signal.image} alt={signal.assetName} className="h-6 w-6" />
            )}
            {signal.assetName} ({signal.assetSymbol})
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {signal.marketType === "crypto" ? "Cryptocurrency" : 
             signal.marketType === "forex" ? "Forex Pair" : "Commodity"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => handleShare("telegram")}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button className="bg-green-600 hover:bg-green-700" size="sm" onClick={() => handleShare("whatsapp")}>
            Share Signal
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <Tabs value={activeTab} onValueChange={(tab) => setActiveTab(tab as "analysis" | "chart")}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="analysis">Signal Analysis</TabsTrigger>
            <TabsTrigger value="chart">Price Chart</TabsTrigger>
          </TabsList>
          
          <TabsContent value="analysis" className="mt-0">
            <div className="p-4 rounded-lg bg-muted/40 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {signal.direction === "buy" ? (
                    <div className="p-1.5 rounded-full bg-green-500/20">
                      <ArrowUp className="h-5 w-5 text-green-500" />
                    </div>
                  ) : (
                    <div className="p-1.5 rounded-full bg-red-500/20">
                      <ArrowDown className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                  <div>
                    <p className="text-lg font-semibold">
                      {signal.direction === "buy" ? "Buy" : "Sell"} Signal
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {signal.timeFrame === "short" ? "Short-term" : 
                       signal.timeFrame === "medium" ? "Medium-term" : "Long-term"} prediction
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Probability</p>
                  <p className={`font-semibold text-lg ${signal.probability > 75 ? "text-green-500" : "text-amber-500"}`}>
                    {signal.probability}%
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <StatCard label="Entry Price" value={formatPrice(signal.entryPrice)} />
                <StatCard label="Target Price" value={formatPrice(signal.targetPrice)} />
                <StatCard label="Stop Loss" value={formatPrice(signal.stopLoss)} />
                <StatCard label="Risk/Reward" value={signal.riskReward.toString()} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Entry Time</p>
                  <p className="font-medium">
                    {format(new Date(signal.entryTime), "MMM dd, yyyy HH:mm")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expected Exit</p>
                  <p className="font-medium">
                    {format(new Date(signal.expectedExitTime), "MMM dd, yyyy HH:mm")}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium mb-2">AI Analysis</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {generateAnalysisText(signal)}
              </p>
            </div>
            
            {signal.status === "completed" && (
              <div className={`p-4 rounded-lg ${
                signal.result === "profit" ? "bg-green-500/10" : "bg-red-500/10"
              }`}>
                <h3 className="font-medium mb-2">Signal Result</h3>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Exited on {format(new Date(signal.actualExitTime!), "MMM dd, yyyy HH:mm")}
                    </p>
                    <p className={`font-medium ${
                      signal.result === "profit" ? "text-green-500" : "text-red-500"
                    }`}>
                      {signal.result === "profit" ? "Profit" : "Loss"}: {formatPercentage(Math.abs(signal.resultAmount || 0))}
                    </p>
                  </div>
                  <div className={`text-xl font-bold ${
                    signal.result === "profit" ? "text-green-500" : "text-red-500"
                  }`}>
                    {signal.result === "profit" ? "+" : "-"}{formatPercentage(Math.abs(signal.resultAmount || 0))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="chart" className="mt-0">
            <div className="bg-muted/40 rounded-lg p-4">
              <div className="mb-4">
                <p className="font-medium">Price Chart</p>
                <p className="text-sm text-muted-foreground">
                  Historical price data for {signal.assetName}
                </p>
              </div>
              
              <PriceChart 
                cryptoId={signal.marketId}
                days={signal.timeFrame === "short" ? 1 : signal.timeFrame === "medium" ? 7 : 30}
                height={300}
              />
              
              <div className="mt-4 p-3 border border-border rounded-md">
                <p className="text-sm font-medium mb-2">Key Levels</p>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="p-2 bg-red-500/10 rounded-md text-center">
                    <p className="text-muted-foreground">Stop Loss</p>
                    <p className="font-medium">{formatPrice(signal.stopLoss)}</p>
                  </div>
                  <div className="p-2 bg-blue-500/10 rounded-md text-center">
                    <p className="text-muted-foreground">Entry</p>
                    <p className="font-medium">{formatPrice(signal.entryPrice)}</p>
                  </div>
                  <div className="p-2 bg-green-500/10 rounded-md text-center">
                    <p className="text-muted-foreground">Target</p>
                    <p className="font-medium">{formatPrice(signal.targetPrice)}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

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

export default SignalDetails;
