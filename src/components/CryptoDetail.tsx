
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice, formatPercentage } from "@/utils/formatters";
import { fetchCryptoDetails, CryptoDetail as CryptoDetailType } from "@/services/cryptoService";

interface CryptoDetailProps {
  cryptoId: string;
}

const CryptoDetail: React.FC<CryptoDetailProps> = ({ cryptoId }) => {
  const [cryptoData, setCryptoData] = useState<CryptoDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCryptoData = async () => {
      setLoading(true);
      try {
        const data = await fetchCryptoDetails(cryptoId);
        setCryptoData(data);
      } catch (error) {
        console.error(`Error fetching details for ${cryptoId}:`, error);
      } finally {
        setLoading(false);
      }
    };

    loadCryptoData();
  }, [cryptoId]);

  if (loading) {
    return (
      <Card className="h-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!cryptoData) {
    return (
      <Card className="h-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <p className="text-destructive">Failed to load cryptocurrency data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const {
    name,
    symbol,
    market_data: {
      current_price,
      price_change_percentage_24h,
      price_change_percentage_7d,
      price_change_percentage_30d,
      market_cap,
      total_volume,
      high_24h,
      low_24h,
    },
  } = cryptoData;

  const stats = [
    {
      label: "Market Cap",
      value: formatPrice(market_cap.usd),
    },
    {
      label: "Volume (24h)",
      value: formatPrice(total_volume.usd),
    },
    {
      label: "24h High / Low",
      value: `${formatPrice(high_24h.usd)} / ${formatPrice(low_24h.usd)}`,
    },
  ];

  const percentChanges = [
    {
      label: "24h",
      value: price_change_percentage_24h,
    },
    {
      label: "7d",
      value: price_change_percentage_7d,
    },
    {
      label: "30d",
      value: price_change_percentage_30d,
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Price Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-2xl font-bold">
            {name} <span className="text-muted-foreground">({symbol.toUpperCase()})</span>
          </h2>
        </div>

        <div className="mb-6">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatPrice(current_price.usd)}</span>
            <span
              className={
                price_change_percentage_24h >= 0
                  ? "text-price-up"
                  : "text-price-down"
              }
            >
              {formatPercentage(price_change_percentage_24h)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Last 24 hours</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-muted/30 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="font-medium">{stat.value}</p>
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-sm mb-3">Price Change</h3>
          <div className="grid grid-cols-3 gap-3">
            {percentChanges.map((change) => (
              <div key={change.label} className="bg-muted/30 p-3 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-1">{change.label}</p>
                <p
                  className={
                    change.value >= 0 ? "text-price-up font-medium" : "text-price-down font-medium"
                  }
                >
                  {formatPercentage(change.value)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoDetail;
