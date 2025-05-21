
import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { fetchHistoricalData, HistoricalData } from "@/services/cryptoService";
import { formatPrice } from "@/utils/formatters";

interface ChartData {
  date: string;
  price: number;
  timestamp: number;
}

interface PriceChartProps {
  cryptoId: string;
  days?: number;
  interval?: string;
  height?: number;
}

const PriceChart: React.FC<PriceChartProps> = ({
  cryptoId,
  days = 7,
  interval = "hourly",
  height = 300,
}) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChartData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchHistoricalData(cryptoId, days, interval);
        const formattedData = formatChartData(data);
        setChartData(formattedData);
      } catch (err) {
        console.error("Error loading chart data:", err);
        setError("Failed to load chart data");
      } finally {
        setLoading(false);
      }
    };

    loadChartData();
    
    // Listen for market data updates
    const handleMarketUpdate = async () => {
      try {
        const data = await fetchHistoricalData(cryptoId, days, interval);
        const formattedData = formatChartData(data);
        setChartData(formattedData);
      } catch (err) {
        console.error("Error updating chart data:", err);
      }
    };

    window.addEventListener('marketDataUpdated', handleMarketUpdate);
    
    // Set up regular refresh interval
    const refreshInterval = setInterval(() => {
      loadChartData();
    }, 30000); // Refresh every 30 seconds
    
    return () => {
      window.removeEventListener('marketDataUpdated', handleMarketUpdate);
      clearInterval(refreshInterval);
    };
  }, [cryptoId, days, interval]);

  const formatChartData = (data: HistoricalData): ChartData[] => {
    return data.prices.map(([timestamp, price]) => {
      const date = new Date(timestamp);
      
      // Format date based on time range
      let formattedDate = "";
      if (days <= 1) {
        formattedDate = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      } else if (days <= 7) {
        formattedDate = date.toLocaleDateString([], { weekday: "short", hour: "2-digit" });
      } else {
        formattedDate = date.toLocaleDateString([], { month: "short", day: "numeric" });
      }
      
      return {
        date: formattedDate,
        price,
        timestamp,
      };
    });
  };

  const priceFormatter = (value: number) => formatPrice(value);

  // Determine if the chart shows a positive or negative trend
  const startPrice = chartData.length > 0 ? chartData[0].price : 0;
  const endPrice = chartData.length > 0 ? chartData[chartData.length - 1].price : 0;
  const isPriceUp = endPrice >= startPrice;

  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#8E9196", fontSize: 12 }}
            minTickGap={30}
          />
          <YAxis
            domain={["auto", "auto"]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#8E9196", fontSize: 12 }}
            width={60}
            tickFormatter={priceFormatter}
          />
          <Tooltip
            formatter={(value: number) => [priceFormatter(value), "Price"]}
            labelFormatter={(label) => `Date: ${label}`}
            contentStyle={{ 
              backgroundColor: "rgba(22, 22, 26, 0.95)",
              borderColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "0.5rem"
            }}
            itemStyle={{ color: isPriceUp ? "#22c55e" : "#ef4444" }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={isPriceUp ? "#22c55e" : "#ef4444"}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
            isAnimationActive={true} /* Enable animation for better visual feedback */
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
