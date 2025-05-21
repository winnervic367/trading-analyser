
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchTopCryptos, CryptoCurrency } from "@/services/cryptoService";
import { formatPrice, formatPercentage } from "@/utils/formatters";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CryptoWatchlistProps {
  onSelectCrypto?: (crypto: CryptoCurrency) => void;
  selectedCryptoId?: string;
}

const CryptoWatchlist: React.FC<CryptoWatchlistProps> = ({
  onSelectCrypto,
  selectedCryptoId
}) => {
  const [cryptos, setCryptos] = useState<CryptoCurrency[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCryptos = async () => {
      try {
        const data = await fetchTopCryptos(20);
        setCryptos(data);
      } catch (error) {
        console.error("Error fetching cryptocurrencies:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCryptos();
    
    // Set up interval for real-time updates
    const updateInterval = setInterval(async () => {
      try {
        const data = await fetchTopCryptos(20);
        setCryptos(data);
      } catch (error) {
        console.error("Error updating cryptocurrency data:", error);
      }
    }, 15000); // Update every 15 seconds
    
    // Listen for market data update events
    const handleMarketUpdate = () => {
      loadCryptos();
    };
    
    window.addEventListener('marketDataUpdated', handleMarketUpdate);
    
    return () => {
      clearInterval(updateInterval);
      window.removeEventListener('marketDataUpdated', handleMarketUpdate);
    };
  }, []);

  const filteredCryptos = cryptos.filter((crypto) =>
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          Watchlist
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="max-w-[180px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <div className="relative">
            <div className="custom-scrollbar overflow-auto max-h-[500px]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-2 text-left text-sm">Asset</th>
                    <th className="px-4 py-2 text-right text-sm">Price</th>
                    <th className="px-4 py-2 text-right text-sm">24h</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCryptos.map((crypto) => (
                    <tr
                      key={crypto.id}
                      className={`border-b border-border cursor-pointer hover:bg-accent/30 transition-colors ${
                        selectedCryptoId === crypto.id ? "bg-accent/30" : ""
                      }`}
                      onClick={() => onSelectCrypto && onSelectCrypto(crypto)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={crypto.image}
                            alt={crypto.name}
                            className="w-6 h-6"
                          />
                          <div>
                            <div className="font-medium">{crypto.symbol.toUpperCase()}</div>
                            <div className="text-xs text-muted-foreground">{crypto.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">{formatPrice(crypto.current_price)}</td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={
                            crypto.price_change_percentage_24h >= 0
                              ? "price-change-badge-up"
                              : "price-change-badge-down"
                          }
                        >
                          {formatPercentage(crypto.price_change_percentage_24h)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CryptoWatchlist;
