
import React from 'react';
import { PredictionSignal } from "@/types/market";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PriceChart from "@/components/PriceChart";
import { formatPrice, formatPercentage } from "@/utils/formatters";

interface SignalChartDialogProps {
  signal: PredictionSignal;
}

const SignalChartDialog: React.FC<SignalChartDialogProps> = ({
  signal
}) => {
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs h-8"
          onClick={(e) => {
            e.stopPropagation();
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
  );
};

export default SignalChartDialog;
