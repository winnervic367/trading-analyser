
import React from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface Trade {
  id: string;
  asset: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  profit?: number;
}

interface Alert {
  id: string;
  asset: string;
  type: 'price' | 'sentiment' | 'technical' | 'ai';
  condition: string;
  date: string;
  triggered: boolean;
}

const History = () => {
  const [trades, setTrades] = React.useState<Trade[]>([]);
  const [alerts, setAlerts] = React.useState<Alert[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulating API fetch delay
    const timer = setTimeout(() => {
      setTrades(getMockTrades());
      setAlerts(getMockAlerts());
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTradeStatusIcon = (status: string) => {
    switch(status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending': return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'failed': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return null;
    }
  };

  const getAlertTypeLabel = (type: string) => {
    switch(type) {
      case 'price': return <span className="bg-blue-500/20 text-blue-500 px-2 py-1 text-xs rounded-full">Price Alert</span>;
      case 'sentiment': return <span className="bg-purple-500/20 text-purple-500 px-2 py-1 text-xs rounded-full">Sentiment Alert</span>;
      case 'technical': return <span className="bg-amber-500/20 text-amber-500 px-2 py-1 text-xs rounded-full">Technical Alert</span>;
      case 'ai': return <span className="bg-green-500/20 text-green-500 px-2 py-1 text-xs rounded-full">AI Prediction Alert</span>;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header title="History & Alerts" />
        
        <main className="flex-1 overflow-y-auto p-4 pb-8 custom-scrollbar">
          <Tabs defaultValue="trades">
            <TabsList className="mb-4 bg-background border">
              <TabsTrigger value="trades">Trading History</TabsTrigger>
              <TabsTrigger value="alerts">Alert History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="trades">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Trades</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">Date</TableHead>
                            <TableHead>Asset</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Value</TableHead>
                            <TableHead className="text-right">Profit/Loss</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {trades.map(trade => (
                            <TableRow key={trade.id}>
                              <TableCell className="text-xs">{formatDate(trade.date)}</TableCell>
                              <TableCell className="font-medium">{trade.asset}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  trade.type === 'buy' 
                                    ? 'bg-green-500/20 text-green-500' 
                                    : 'bg-red-500/20 text-red-500'
                                }`}>
                                  {trade.type.toUpperCase()}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">{trade.amount.toFixed(5)}</TableCell>
                              <TableCell className="text-right">${trade.price.toLocaleString()}</TableCell>
                              <TableCell className="text-right">${(trade.amount * trade.price).toLocaleString()}</TableCell>
                              <TableCell className={`text-right ${
                                trade.profit && trade.profit > 0 
                                  ? 'text-green-500' 
                                  : trade.profit && trade.profit < 0 
                                  ? 'text-red-500' 
                                  : ''
                              }`}>
                                {trade.profit 
                                  ? `${trade.profit > 0 ? '+' : ''}$${Math.abs(trade.profit).toLocaleString()}`
                                  : '-'
                                }
                              </TableCell>
                              <TableCell className="text-center">
                                {getTradeStatusIcon(trade.status)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="alerts">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[100px]">Date</TableHead>
                            <TableHead>Asset</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Condition</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {alerts.map(alert => (
                            <TableRow key={alert.id}>
                              <TableCell className="text-xs">{formatDate(alert.date)}</TableCell>
                              <TableCell className="font-medium">{alert.asset}</TableCell>
                              <TableCell>{getAlertTypeLabel(alert.type)}</TableCell>
                              <TableCell>{alert.condition}</TableCell>
                              <TableCell className="text-center">
                                {alert.triggered 
                                  ? <CheckCircle className="h-5 w-5 text-green-500 mx-auto" /> 
                                  : <AlertCircle className="h-5 w-5 text-amber-500 mx-auto" />}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

// Mock data generators
const getMockTrades = (): Trade[] => {
  return [
    {
      id: '1',
      asset: 'Bitcoin (BTC)',
      type: 'buy',
      amount: 0.35,
      price: 62350,
      date: '2025-05-17T09:30:00Z',
      status: 'completed',
      profit: 1250
    },
    {
      id: '2',
      asset: 'Ethereum (ETH)',
      type: 'buy',
      amount: 2.5,
      price: 3025,
      date: '2025-05-16T14:45:00Z',
      status: 'completed',
      profit: 325
    },
    {
      id: '3',
      asset: 'Solana (SOL)',
      type: 'sell',
      amount: 10,
      price: 125.50,
      date: '2025-05-15T11:20:00Z',
      status: 'completed',
      profit: -230
    },
    {
      id: '4',
      asset: 'Binance Coin (BNB)',
      type: 'buy',
      amount: 5,
      price: 535,
      date: '2025-05-14T16:10:00Z',
      status: 'completed',
      profit: 165
    },
    {
      id: '5',
      asset: 'Cardano (ADA)',
      type: 'buy',
      amount: 500,
      price: 0.65,
      date: '2025-05-13T08:55:00Z',
      status: 'pending'
    },
    {
      id: '6',
      asset: 'Polkadot (DOT)',
      type: 'sell',
      amount: 100,
      price: 12.35,
      date: '2025-05-12T13:45:00Z',
      status: 'completed',
      profit: 435
    },
    {
      id: '7',
      asset: 'Avalanche (AVAX)',
      type: 'buy',
      amount: 20,
      price: 38.75,
      date: '2025-05-11T10:15:00Z',
      status: 'failed'
    }
  ];
};

const getMockAlerts = (): Alert[] => {
  return [
    {
      id: '1',
      asset: 'Bitcoin (BTC)',
      type: 'price',
      condition: 'Price above $63,000',
      date: '2025-05-17T10:15:00Z',
      triggered: true
    },
    {
      id: '2',
      asset: 'Ethereum (ETH)',
      type: 'sentiment',
      condition: 'Sentiment shifts to strongly bullish',
      date: '2025-05-16T15:30:00Z',
      triggered: true
    },
    {
      id: '3',
      asset: 'Solana (SOL)',
      type: 'technical',
      condition: 'RSI below 30 (oversold)',
      date: '2025-05-15T12:45:00Z',
      triggered: true
    },
    {
      id: '4',
      asset: 'Bitcoin (BTC)',
      type: 'ai',
      condition: 'AI predicts >5% price move within 24h',
      date: '2025-05-15T09:20:00Z',
      triggered: true
    },
    {
      id: '5',
      asset: 'Binance Coin (BNB)',
      type: 'price',
      condition: 'Price below $520',
      date: '2025-05-14T16:50:00Z',
      triggered: false
    },
    {
      id: '6',
      asset: 'Cardano (ADA)',
      type: 'technical',
      condition: 'MACD bullish crossover',
      date: '2025-05-13T11:10:00Z',
      triggered: false
    },
    {
      id: '7',
      asset: 'Ethereum (ETH)',
      type: 'sentiment',
      condition: 'Negative news sentiment detected',
      date: '2025-05-12T14:25:00Z',
      triggered: false
    }
  ];
};

export default History;
