
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Twitter, Youtube, MessageSquare, Newspaper, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatPrice } from "@/utils/formatters";

interface SentimentEngineProps {
  cryptoId: string;
}

const SentimentEngine: React.FC<SentimentEngineProps> = ({ cryptoId }) => {
  // Generate sentiment trend data - latest 7 days of sentiment scores
  const getSentimentTrendData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate a value with some continuity from previous day
      const prevValue = i < 6 ? data[5-i].value : 60;
      const change = Math.random() * 10 - 5; // -5 to +5 change
      const newValue = Math.max(30, Math.min(90, prevValue + change));
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: newValue
      });
    }
    
    return data;
  };
  
  const sentimentTrend = getSentimentTrendData();
  
  // Get sentiment score from different platforms
  const getSentimentSources = () => {
    // Vary the sentiment based on cryptoId to make it seem real
    const hashCode = (s: string) => s.split('').reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0))|0, 0);
    const seed = hashCode(cryptoId);
    
    return {
      twitter: 50 + (seed % 11) - 5 + Math.floor(Math.random() * 10),
      reddit: 50 + ((seed * 3) % 11) - 5 + Math.floor(Math.random() * 10),
      youtube: 50 + ((seed * 7) % 11) - 5 + Math.floor(Math.random() * 10),
      news: 50 + ((seed * 11) % 11) - 5 + Math.floor(Math.random() * 10)
    };
  };
  
  const sentimentSources = getSentimentSources();
  
  // Calculate overall score as weighted average
  const overallSentiment = Math.round(
    (sentimentSources.twitter * 0.35) +
    (sentimentSources.reddit * 0.25) +
    (sentimentSources.youtube * 0.15) +
    (sentimentSources.news * 0.25)
  );
  
  // Get sentiment category
  const getSentimentCategory = (score: number) => {
    if (score >= 75) return { label: "Very Bullish", color: "text-emerald-500" };
    if (score >= 60) return { label: "Bullish", color: "text-green-500" };
    if (score >= 45) return { label: "Neutral", color: "text-blue-500" };
    if (score >= 30) return { label: "Bearish", color: "text-red-500" };
    return { label: "Very Bearish", color: "text-rose-600" };
  };
  
  const sentimentCategory = getSentimentCategory(overallSentiment);
  
  // Get key emotions detected
  const getKeyEmotions = () => {
    const emotions = [
      'optimism', 'confidence', 'concern', 'uncertainty', 
      'fear', 'excitement', 'anticipation', 'caution'
    ];
    
    // Select 2-3 emotions based on sentiment score
    const selectedEmotions = [];
    
    if (overallSentiment >= 60) {
      selectedEmotions.push('optimism', 'confidence');
      if (Math.random() > 0.5) selectedEmotions.push('excitement');
    } else if (overallSentiment >= 45) {
      selectedEmotions.push('cautious optimism', 'uncertainty');
      if (Math.random() > 0.5) selectedEmotions.push('anticipation');
    } else {
      selectedEmotions.push('concern', 'caution');
      if (Math.random() > 0.5) selectedEmotions.push('fear');
    }
    
    return selectedEmotions;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          Market Sentiment Pulse
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overall sentiment meter */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-trading-down">Bearish</span>
              <span className={`text-base font-semibold ${sentimentCategory.color}`}>
                {sentimentCategory.label}
              </span>
              <span className="text-sm text-trading-up">Bullish</span>
            </div>
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
                  overallSentiment >= 75 ? "bg-emerald-500" :
                  overallSentiment >= 60 ? "bg-green-500" :
                  overallSentiment >= 45 ? "bg-blue-500" :
                  overallSentiment >= 30 ? "bg-red-500" : "bg-rose-600"
                }`}
                style={{ width: `${overallSentiment}%` }}
              ></div>
            </div>
            <div className="mt-3 text-sm">
              <span className="font-medium">Key emotions detected: </span>
              {getKeyEmotions().map((emotion, i) => (
                <span 
                  key={emotion} 
                  className={`${i > 0 ? "ml-2" : ""} ${
                    overallSentiment >= 60 ? "text-green-500" :
                    overallSentiment >= 45 ? "text-blue-500" : "text-red-500"
                  }`}
                >
                  {emotion}
                  {i < getKeyEmotions().length - 1 ? "," : ""}
                </span>
              ))}
            </div>
          </div>
          
          {/* Sentiment trend chart */}
          <div>
            <h3 className="text-sm font-medium mb-2">7-Day Sentiment Trend</h3>
            <div className="h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sentimentTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#8E9196", fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#8E9196", fontSize: 12 }}
                    width={30}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value.toFixed(1)}`, "Sentiment Score"]}
                    contentStyle={{ 
                      backgroundColor: "rgba(22, 22, 26, 0.95)",
                      borderColor: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "0.5rem"
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#9b87f5"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#9b87f5" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Source breakdown */}
          <div>
            <h3 className="text-sm font-medium mb-2">Source Breakdown</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-8">
                  <Twitter className="h-4 w-4 text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Twitter</span>
                    <span className={`font-medium ${getSentimentCategory(sentimentSources.twitter).color}`}>
                      {sentimentSources.twitter}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-400"
                      style={{ width: `${sentimentSources.twitter}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8">
                  <MessageSquare className="h-4 w-4 text-orange-400" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Reddit</span>
                    <span className={`font-medium ${getSentimentCategory(sentimentSources.reddit).color}`}>
                      {sentimentSources.reddit}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-400"
                      style={{ width: `${sentimentSources.reddit}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8">
                  <Youtube className="h-4 w-4 text-red-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span>YouTube</span>
                    <span className={`font-medium ${getSentimentCategory(sentimentSources.youtube).color}`}>
                      {sentimentSources.youtube}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500"
                      style={{ width: `${sentimentSources.youtube}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8">
                  <Newspaper className="h-4 w-4 text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span>News</span>
                    <span className={`font-medium ${getSentimentCategory(sentimentSources.news).color}`}>
                      {sentimentSources.news}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-400"
                      style={{ width: `${sentimentSources.news}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SentimentEngine;
