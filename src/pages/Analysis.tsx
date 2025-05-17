
import React from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import CryptoWatchlist from "@/components/CryptoWatchlist";
import PriceChart from "@/components/PriceChart";
import CryptoDetail from "@/components/CryptoDetail";
import MarketSentiment from "@/components/MarketSentiment";
import TechnicalIndicators from "@/components/TechnicalIndicators";

const Analysis = () => {
  const [selectedCrypto, setSelectedCrypto] = React.useState({
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 62453.12,
    market_cap: 1223567890123,
    market_cap_rank: 1,
    price_change_percentage_24h: 2.45,
  });

  // Calculate market sentiment
  const getMarketSentiment = (cryptoId: string) => {
    const sentiments = {
      bitcoin: 68,
      ethereum: 72,
      tether: 55,
      binancecoin: 62,
      solana: 78
    };
    
    return sentiments[cryptoId as keyof typeof sentiments] || 
      // For other cryptos, generate a random sentiment
      Math.floor(Math.random() * 40) + 40;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header title="Technical Analysis" />
        
        <main className="flex-1 overflow-y-auto p-4 pb-8 custom-scrollbar">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
            <div className="col-span-1 xl:col-span-2">
              <div className="p-4 trading-card mb-4">
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
                    <img src={selectedCrypto.image} alt={selectedCrypto.name} className="h-6 w-6" />
                    {selectedCrypto.name} ({selectedCrypto.symbol.toUpperCase()}) Price Chart
                  </h2>
                </div>
                
                <div className="mb-4 flex flex-wrap gap-2">
                  <button className="px-3 py-1 text-xs font-medium bg-accent rounded-md">24H</button>
                  <button className="px-3 py-1 text-xs font-medium bg-muted/30 hover:bg-accent rounded-md transition-colors">7D</button>
                  <button className="px-3 py-1 text-xs font-medium bg-muted/30 hover:bg-accent rounded-md transition-colors">30D</button>
                  <button className="px-3 py-1 text-xs font-medium bg-muted/30 hover:bg-accent rounded-md transition-colors">90D</button>
                  <button className="px-3 py-1 text-xs font-medium bg-muted/30 hover:bg-accent rounded-md transition-colors">1Y</button>
                  <button className="px-3 py-1 text-xs font-medium bg-muted/30 hover:bg-accent rounded-md transition-colors">All</button>
                </div>
                
                <PriceChart cryptoId={selectedCrypto.id} height={400} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CryptoDetail cryptoId={selectedCrypto.id} />
                <TechnicalIndicators cryptoId={selectedCrypto.id} />
              </div>
            </div>
            
            <div className="col-span-1 space-y-4">
              <CryptoWatchlist
                onSelectCrypto={setSelectedCrypto}
                selectedCryptoId={selectedCrypto.id}
              />
              <MarketSentiment bullishPercentage={getMarketSentiment(selectedCrypto.id)} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Analysis;
