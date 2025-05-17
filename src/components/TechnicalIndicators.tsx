
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

interface TechnicalIndicatorsProps {
  cryptoId: string;
}

const TechnicalIndicators: React.FC<TechnicalIndicatorsProps> = ({ cryptoId }) => {
  // Sample data for indicators
  const rsiData = Array(30).fill(0).map((_, i) => ({
    date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: 30 + Math.random() * 40 + (i > 20 ? 10 : 0)
  }));

  const macdData = Array(30).fill(0).map((_, i) => ({
    date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    macd: Math.sin(i / 5) * 2 + (i > 15 ? 1 : -1),
    signal: Math.sin((i + 2) / 5) * 1.5
  }));

  const bollingerData = Array(30).fill(0).map((_, i) => {
    const basePrice = 60000 - (30 - i) * 200 + Math.random() * 1000;
    const volatility = 1000 + Math.random() * 500;
    
    return {
      date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: basePrice,
      upper: basePrice + volatility * 2,
      lower: basePrice - volatility * 2,
      middle: basePrice
    };
  });

  const getIndicatorSignal = (indicator: string) => {
    const signals = {
      'rsi': { signal: 'Oversold', strength: 7 },
      'macd': { signal: 'Bullish Crossover', strength: 8 },
      'bollinger': { signal: 'Squeeze', strength: 6 }
    };
    
    return signals[indicator as keyof typeof signals] || { signal: 'Neutral', strength: 5 };
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Technical Indicators</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="rsi">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="rsi" className="flex-1">RSI</TabsTrigger>
            <TabsTrigger value="macd" className="flex-1">MACD</TabsTrigger>
            <TabsTrigger value="bollinger" className="flex-1">Bollinger</TabsTrigger>
          </TabsList>
          
          <TabsContent value="rsi">
            <div className="space-y-4">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={rsiData}>
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "#8E9196", fontSize: 10 }}
                      minTickGap={15}
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "#8E9196", fontSize: 10 }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "rgba(22, 22, 26, 0.95)", borderColor: "rgba(255, 255, 255, 0.1)" }}
                      itemStyle={{ color: "#22c55e" }}
                    />
                    <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" />
                    <ReferenceLine y={30} stroke="#22c55e" strokeDasharray="3 3" />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#7E69AB" 
                      strokeWidth={2} 
                      dot={false} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Current RSI</p>
                    <p className="font-mono font-medium">{rsiData[rsiData.length - 1].value.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Signal</p>
                    <p className="font-medium text-green-500">{getIndicatorSignal('rsi').signal}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Oversold Threshold</p>
                    <p className="font-mono font-medium">30.00</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Overbought Threshold</p>
                    <p className="font-mono font-medium">70.00</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="macd">
            <div className="space-y-4">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={macdData}>
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "#8E9196", fontSize: 10 }}
                      minTickGap={15}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "#8E9196", fontSize: 10 }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "rgba(22, 22, 26, 0.95)", borderColor: "rgba(255, 255, 255, 0.1)" }}
                    />
                    <ReferenceLine y={0} stroke="rgba(255, 255, 255, 0.1)" />
                    <Line 
                      type="monotone" 
                      dataKey="macd" 
                      stroke="#22c55e" 
                      strokeWidth={2} 
                      dot={false} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="signal" 
                      stroke="#ef4444" 
                      strokeWidth={2} 
                      dot={false} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">MACD Line</p>
                    <p className="font-mono font-medium">{macdData[macdData.length - 1].macd.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Signal Line</p>
                    <p className="font-mono font-medium">{macdData[macdData.length - 1].signal.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Signal</p>
                    <p className="font-medium text-green-500">{getIndicatorSignal('macd').signal}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Histogram</p>
                    <p className="font-mono font-medium">{(macdData[macdData.length - 1].macd - macdData[macdData.length - 1].signal).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="bollinger">
            <div className="space-y-4">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bollingerData}>
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "#8E9196", fontSize: 10 }}
                      minTickGap={15}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "#8E9196", fontSize: 10 }}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "rgba(22, 22, 26, 0.95)", borderColor: "rgba(255, 255, 255, 0.1)" }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="upper" 
                      stroke="#ef4444" 
                      strokeWidth={1} 
                      dot={false}
                      strokeDasharray="3 3"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="middle" 
                      stroke="#8E9196" 
                      strokeWidth={2} 
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="lower" 
                      stroke="#22c55e" 
                      strokeWidth={1} 
                      dot={false}
                      strokeDasharray="3 3"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#7E69AB" 
                      strokeWidth={2} 
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Upper Band</p>
                    <p className="font-mono font-medium">${bollingerData[bollingerData.length - 1].upper.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Middle Band (SMA20)</p>
                    <p className="font-mono font-medium">${bollingerData[bollingerData.length - 1].middle.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Lower Band</p>
                    <p className="font-mono font-medium">${bollingerData[bollingerData.length - 1].lower.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Signal</p>
                    <p className="font-medium text-amber-500">{getIndicatorSignal('bollinger').signal}</p>
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

export default TechnicalIndicators;
