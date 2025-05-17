
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, TrendingUp, TrendingDown } from "lucide-react";

interface PredictionProps {
  cryptoName: string;
  cryptoSymbol: string;
  shortTermPrediction: {
    direction: 'up' | 'down' | 'neutral';
    confidence: number;
    target: number;
    timeframe: string;
  };
  longTermPrediction: {
    direction: 'up' | 'down' | 'neutral';
    confidence: number;
    target: number;
    timeframe: string;
  };
}

const AIPrediction: React.FC<PredictionProps> = ({
  cryptoName,
  cryptoSymbol,
  shortTermPrediction,
  longTermPrediction
}) => {
  const getPredictionColor = (direction: 'up' | 'down' | 'neutral') => {
    if (direction === 'up') return "text-trading-up";
    if (direction === 'down') return "text-trading-down";
    return "text-trading-neutral";
  };

  const getDirectionIcon = (direction: 'up' | 'down' | 'neutral') => {
    if (direction === 'up') return <TrendingUp className="w-4 h-4 text-trading-up" />;
    if (direction === 'down') return <TrendingDown className="w-4 h-4 text-trading-down" />;
    return null;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-trading-purple" />
          AI Price Prediction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="mb-2 text-sm text-muted-foreground">Short-term forecast ({shortTermPrediction.timeframe})</div>
            <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                {getDirectionIcon(shortTermPrediction.direction)}
                <span className={`font-medium ${getPredictionColor(shortTermPrediction.direction)}`}>
                  ${shortTermPrediction.target.toLocaleString()}
                </span>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">AI Confidence</div>
                <div className="w-32 bg-muted h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-trading-purple"
                    style={{ width: `${shortTermPrediction.confidence}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="mb-2 text-sm text-muted-foreground">Long-term forecast ({longTermPrediction.timeframe})</div>
            <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                {getDirectionIcon(longTermPrediction.direction)}
                <span className={`font-medium ${getPredictionColor(longTermPrediction.direction)}`}>
                  ${longTermPrediction.target.toLocaleString()}
                </span>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">AI Confidence</div>
                <div className="w-32 bg-muted h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-trading-purple"
                    style={{ width: `${longTermPrediction.confidence}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              AI analysis based on technical indicators, sentiment data, and market trends. Predictions are not financial advice.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIPrediction;
