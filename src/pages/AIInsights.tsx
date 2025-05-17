
import React from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import CryptoWatchlist from "@/components/CryptoWatchlist";
import AIPrediction from "@/components/AIPrediction";
import { CryptoCurrency } from "@/services/cryptoService";
import SentimentEngine from "@/components/SentimentEngine";
import NewsIntelligence from "@/components/NewsIntelligence";
import UserProfileMenu from "@/components/UserProfileMenu";

const AIInsights = () => {
  const [selectedCrypto, setSelectedCrypto] = React.useState<CryptoCurrency>({
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 62453.12,
    market_cap: 1223567890123,
    market_cap_rank: 1,
    price_change_percentage_24h: 2.45,
  });

  // Mock data for AI predictions
  const getAIPredictions = (cryptoId: string) => {
    const predictions = {
      bitcoin: {
        shortTerm: {
          direction: 'up' as const,
          confidence: 78,
          target: 65800,
          timeframe: '24h'
        },
        longTerm: {
          direction: 'up' as const,
          confidence: 82,
          target: 72000,
          timeframe: '30d'
        }
      },
      ethereum: {
        shortTerm: {
          direction: 'up' as const,
          confidence: 65,
          target: 3150,
          timeframe: '24h'
        },
        longTerm: {
          direction: 'up' as const,
          confidence: 71,
          target: 3400,
          timeframe: '30d'
        }
      }
    };
    
    // Default predictions for other cryptocurrencies
    return predictions[cryptoId as keyof typeof predictions] || {
      shortTerm: {
        direction: Math.random() > 0.5 ? 'up' as const : 'down' as const,
        confidence: 50 + Math.floor(Math.random() * 40),
        target: selectedCrypto.current_price * (1 + (Math.random() * 0.1 - 0.05)),
        timeframe: '24h'
      },
      longTerm: {
        direction: Math.random() > 0.4 ? 'up' as const : 'down' as const,
        confidence: 50 + Math.floor(Math.random() * 30),
        target: selectedCrypto.current_price * (1 + (Math.random() * 0.3 - 0.15)),
        timeframe: '30d'
      }
    };
  };

  // Ensure we always have a valid ID
  const cryptoId = selectedCrypto?.id || "bitcoin";
  
  const predictions = getAIPredictions(cryptoId);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header title="AI Insights" />
        
        <main className="flex-1 overflow-y-auto p-4 pb-8 custom-scrollbar">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="col-span-1 xl:col-span-2 space-y-4">
              <AIPrediction 
                cryptoName={selectedCrypto.name}
                cryptoSymbol={selectedCrypto.symbol}
                shortTermPrediction={predictions.shortTerm}
                longTermPrediction={predictions.longTerm}
              />
              <SentimentEngine cryptoId={cryptoId} />
              <NewsIntelligence cryptoId={cryptoId} />
            </div>
            
            <div className="col-span-1 space-y-4">
              <CryptoWatchlist
                onSelectCrypto={setSelectedCrypto}
                selectedCryptoId={cryptoId}
              />
              <UserProfileMenu />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AIInsights;
