
import React from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchTopCryptos, CryptoCurrency } from "@/services/cryptoService";

const Discover = () => {
  const [cryptos, setCryptos] = React.useState<CryptoCurrency[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadCryptos = async () => {
      try {
        const data = await fetchTopCryptos(50);
        setCryptos(data);
      } catch (error) {
        console.error("Failed to fetch cryptocurrencies:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCryptos();
  }, []);

  const getPerformanceClass = (change: number) => {
    if (change > 10) return "bg-emerald-500/20 text-emerald-500";
    if (change > 0) return "bg-green-500/20 text-green-500";
    if (change < -10) return "bg-red-600/20 text-red-600";
    return "bg-red-500/20 text-red-500";
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header title="Discover" />
        
        <main className="flex-1 overflow-y-auto p-4 pb-8 custom-scrollbar">
          <Tabs defaultValue="trending">
            <TabsList className="mb-4 bg-background border">
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
              <TabsTrigger value="losers">Top Losers</TabsTrigger>
              <TabsTrigger value="volume">Volume Leaders</TabsTrigger>
            </TabsList>
            
            <TabsContent value="trending">
              <Card>
                <CardHeader>
                  <CardTitle>Trending Cryptocurrencies</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="grid grid-cols-12 py-2 px-4 text-sm font-medium text-muted-foreground">
                        <div className="col-span-1">#</div>
                        <div className="col-span-5">Name</div>
                        <div className="col-span-2 text-right">Price</div>
                        <div className="col-span-2 text-right">24h %</div>
                        <div className="col-span-2 text-right">Market Cap</div>
                      </div>
                      
                      {cryptos.slice(0, 10).map((crypto) => (
                        <div key={crypto.id} className="grid grid-cols-12 items-center py-3 px-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="col-span-1 text-sm text-muted-foreground">
                            {crypto.market_cap_rank}
                          </div>
                          <div className="col-span-5 flex items-center gap-2">
                            <img src={crypto.image} alt={crypto.name} className="w-6 h-6" />
                            <div>
                              <p className="font-medium">{crypto.name}</p>
                              <p className="text-xs text-muted-foreground">{crypto.symbol.toUpperCase()}</p>
                            </div>
                          </div>
                          <div className="col-span-2 text-right">
                            ${crypto.current_price.toLocaleString()}
                          </div>
                          <div className="col-span-2 text-right">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getPerformanceClass(crypto.price_change_percentage_24h)}`}>
                              {crypto.price_change_percentage_24h > 0 ? '+' : ''}
                              {crypto.price_change_percentage_24h.toFixed(2)}%
                            </span>
                          </div>
                          <div className="col-span-2 text-right text-sm">
                            ${(crypto.market_cap / 1000000000).toFixed(2)}B
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="gainers">
              <Card>
                <CardHeader>
                  <CardTitle>Top Gainers (24h)</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="grid grid-cols-12 py-2 px-4 text-sm font-medium text-muted-foreground">
                        <div className="col-span-1">#</div>
                        <div className="col-span-5">Name</div>
                        <div className="col-span-2 text-right">Price</div>
                        <div className="col-span-2 text-right">24h %</div>
                        <div className="col-span-2 text-right">Market Cap</div>
                      </div>
                      
                      {cryptos
                        .filter(c => c.price_change_percentage_24h > 0)
                        .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
                        .slice(0, 10)
                        .map((crypto) => (
                          <div key={crypto.id} className="grid grid-cols-12 items-center py-3 px-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="col-span-1 text-sm text-muted-foreground">
                              {crypto.market_cap_rank}
                            </div>
                            <div className="col-span-5 flex items-center gap-2">
                              <img src={crypto.image} alt={crypto.name} className="w-6 h-6" />
                              <div>
                                <p className="font-medium">{crypto.name}</p>
                                <p className="text-xs text-muted-foreground">{crypto.symbol.toUpperCase()}</p>
                              </div>
                            </div>
                            <div className="col-span-2 text-right">
                              ${crypto.current_price.toLocaleString()}
                            </div>
                            <div className="col-span-2 text-right">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getPerformanceClass(crypto.price_change_percentage_24h)}`}>
                                +{crypto.price_change_percentage_24h.toFixed(2)}%
                              </span>
                            </div>
                            <div className="col-span-2 text-right text-sm">
                              ${(crypto.market_cap / 1000000000).toFixed(2)}B
                            </div>
                          </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="losers">
              <Card>
                <CardHeader>
                  <CardTitle>Top Losers (24h)</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="grid grid-cols-12 py-2 px-4 text-sm font-medium text-muted-foreground">
                        <div className="col-span-1">#</div>
                        <div className="col-span-5">Name</div>
                        <div className="col-span-2 text-right">Price</div>
                        <div className="col-span-2 text-right">24h %</div>
                        <div className="col-span-2 text-right">Market Cap</div>
                      </div>
                      
                      {cryptos
                        .filter(c => c.price_change_percentage_24h < 0)
                        .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
                        .slice(0, 10)
                        .map((crypto) => (
                          <div key={crypto.id} className="grid grid-cols-12 items-center py-3 px-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="col-span-1 text-sm text-muted-foreground">
                              {crypto.market_cap_rank}
                            </div>
                            <div className="col-span-5 flex items-center gap-2">
                              <img src={crypto.image} alt={crypto.name} className="w-6 h-6" />
                              <div>
                                <p className="font-medium">{crypto.name}</p>
                                <p className="text-xs text-muted-foreground">{crypto.symbol.toUpperCase()}</p>
                              </div>
                            </div>
                            <div className="col-span-2 text-right">
                              ${crypto.current_price.toLocaleString()}
                            </div>
                            <div className="col-span-2 text-right">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getPerformanceClass(crypto.price_change_percentage_24h)}`}>
                                {crypto.price_change_percentage_24h.toFixed(2)}%
                              </span>
                            </div>
                            <div className="col-span-2 text-right text-sm">
                              ${(crypto.market_cap / 1000000000).toFixed(2)}B
                            </div>
                          </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="volume">
              <Card>
                <CardHeader>
                  <CardTitle>Volume Leaders</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="grid grid-cols-12 py-2 px-4 text-sm font-medium text-muted-foreground">
                        <div className="col-span-1">#</div>
                        <div className="col-span-5">Name</div>
                        <div className="col-span-2 text-right">Price</div>
                        <div className="col-span-2 text-right">24h %</div>
                        <div className="col-span-2 text-right">24h Volume</div>
                      </div>
                      
                      {cryptos
                        .sort((a, b) => b.market_cap - a.market_cap)
                        .slice(0, 10)
                        .map((crypto) => (
                          <div key={crypto.id} className="grid grid-cols-12 items-center py-3 px-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="col-span-1 text-sm text-muted-foreground">
                              {crypto.market_cap_rank}
                            </div>
                            <div className="col-span-5 flex items-center gap-2">
                              <img src={crypto.image} alt={crypto.name} className="w-6 h-6" />
                              <div>
                                <p className="font-medium">{crypto.name}</p>
                                <p className="text-xs text-muted-foreground">{crypto.symbol.toUpperCase()}</p>
                              </div>
                            </div>
                            <div className="col-span-2 text-right">
                              ${crypto.current_price.toLocaleString()}
                            </div>
                            <div className="col-span-2 text-right">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getPerformanceClass(crypto.price_change_percentage_24h)}`}>
                                {crypto.price_change_percentage_24h > 0 ? '+' : ''}
                                {crypto.price_change_percentage_24h.toFixed(2)}%
                              </span>
                            </div>
                            <div className="col-span-2 text-right text-sm">
                              ${(crypto.market_cap / 5000).toFixed(2)}M
                            </div>
                          </div>
                      ))}
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

export default Discover;
