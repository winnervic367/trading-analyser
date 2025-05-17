
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SentimentScore {
  name: string;
  value: number;
  color: string;
}

interface MarketSentimentProps {
  bullishPercentage: number;
  sentimentScores?: SentimentScore[];
}

const MarketSentiment: React.FC<MarketSentimentProps> = ({
  bullishPercentage,
  sentimentScores = [
    { name: "Twitter", value: 65, color: "bg-blue-500" },
    { name: "Reddit", value: 72, color: "bg-orange-500" },
    { name: "News", value: 58, color: "bg-green-500" },
    { name: "Youtube", value: 77, color: "bg-red-500" }
  ]
}) => {
  // Determine sentiment category
  const getSentimentCategory = (percentage: number): {label: string, color: string} => {
    if (percentage >= 70) return { label: "Strongly Bullish", color: "text-trading-up" };
    if (percentage >= 55) return { label: "Bullish", color: "text-trading-up" };
    if (percentage >= 45) return { label: "Neutral", color: "text-trading-neutral" };
    if (percentage >= 30) return { label: "Bearish", color: "text-trading-down" };
    return { label: "Strongly Bearish", color: "text-trading-down" };
  };

  const sentimentCategory = getSentimentCategory(bullishPercentage);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Market Sentiment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-1 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-trading-down">Bearish</span>
            <span className={`text-base font-semibold ${sentimentCategory.color}`}>
              {sentimentCategory.label}
            </span>
            <span className="text-sm text-trading-up">Bullish</span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-trading-up rounded-full transition-all duration-500"
              style={{ width: `${bullishPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">Source breakdown</p>
          {sentimentScores.map((source) => (
            <div key={source.name} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{source.name}</span>
                <span className="font-medium">{source.value}%</span>
              </div>
              <Progress 
                value={source.value} 
                className={`h-1 ${source.color}`}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketSentiment;
