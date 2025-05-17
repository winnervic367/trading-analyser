
// Interface for the cryptocurrency data
export interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  sparkline_in_7d?: {
    price: number[];
  };
}

// Interface for the cryptocurrency detail including historical data
export interface CryptoDetail {
  id: string;
  symbol: string;
  name: string;
  market_data: {
    current_price: {
      usd: number;
    };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    high_24h: {
      usd: number;
    };
    low_24h: {
      usd: number;
    };
  };
}

// Interface for historical price data
export interface HistoricalData {
  prices: [number, number][]; // [timestamp, price]
}

// Function to fetch top cryptocurrencies by market cap
export async function fetchTopCryptos(limit = 20): Promise<CryptoCurrency[]> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=true&price_change_percentage=24h,7d`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching top cryptocurrencies:", error);
    // Return some mock data for demonstration if API fails
    return getMockCryptos();
  }
}

// Function to fetch historical data for a specific crypto
export async function fetchHistoricalData(
  id: string,
  days = 7,
  interval = "hourly"
): Promise<HistoricalData> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=${interval}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching historical data for ${id}:`, error);
    // Return mock historical data
    return getMockHistoricalData(days);
  }
}

// Function to fetch detailed information for a specific crypto
export async function fetchCryptoDetails(id: string): Promise<CryptoDetail> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching details for ${id}:`, error);
    // Return mock data for the specified crypto
    return getMockCryptoDetail(id);
  }
}

// Mock data generators for fallback when API calls fail
function getMockCryptos(): CryptoCurrency[] {
  return [
    {
      id: "bitcoin",
      symbol: "btc",
      name: "Bitcoin",
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      current_price: 62453.12,
      market_cap: 1223567890123,
      market_cap_rank: 1,
      price_change_percentage_24h: 2.45,
      sparkline_in_7d: { price: generateRandomPrices(24, 60000, 65000) },
    },
    {
      id: "ethereum",
      symbol: "eth",
      name: "Ethereum",
      image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      current_price: 3025.67,
      market_cap: 365789012345,
      market_cap_rank: 2,
      price_change_percentage_24h: -1.23,
      sparkline_in_7d: { price: generateRandomPrices(24, 2800, 3200) },
    },
    {
      id: "tether",
      symbol: "usdt",
      name: "Tether",
      image: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
      current_price: 1,
      market_cap: 95678901234,
      market_cap_rank: 3,
      price_change_percentage_24h: 0.01,
      sparkline_in_7d: { price: generateRandomPrices(24, 0.99, 1.01) },
    },
    {
      id: "binancecoin",
      symbol: "bnb",
      name: "BNB",
      image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
      current_price: 535.28,
      market_cap: 82345678901,
      market_cap_rank: 4,
      price_change_percentage_24h: 3.12,
      sparkline_in_7d: { price: generateRandomPrices(24, 500, 550) },
    },
    {
      id: "solana",
      symbol: "sol",
      name: "Solana",
      image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
      current_price: 124.35,
      market_cap: 56712345678,
      market_cap_rank: 5,
      price_change_percentage_24h: 5.78,
      sparkline_in_7d: { price: generateRandomPrices(24, 115, 130) },
    },
  ];
}

function getMockHistoricalData(days: number): HistoricalData {
  const now = Date.now();
  const prices: [number, number][] = [];
  
  // Generate mock price data for the specified number of days
  const dataPoints = days * 24; // hourly data
  const basePrice = 60000; // Base price for mock data
  
  for (let i = 0; i < dataPoints; i++) {
    const timestamp = now - (dataPoints - i) * 3600 * 1000; // go back by hours
    const price = basePrice * (1 + 0.1 * Math.sin(i / 24) + 0.05 * Math.random());
    prices.push([timestamp, price]);
  }
  
  return { prices };
}

function getMockCryptoDetail(id: string): CryptoDetail {
  const cryptoDetails: Record<string, CryptoDetail> = {
    bitcoin: {
      id: "bitcoin",
      symbol: "btc",
      name: "Bitcoin",
      market_data: {
        current_price: {
          usd: 62453.12,
        },
        price_change_percentage_24h: 2.45,
        price_change_percentage_7d: 5.67,
        price_change_percentage_30d: 12.34,
        market_cap: {
          usd: 1223567890123,
        },
        total_volume: {
          usd: 45678901234,
        },
        high_24h: {
          usd: 63500,
        },
        low_24h: {
          usd: 61200,
        },
      },
    },
    ethereum: {
      id: "ethereum",
      symbol: "eth",
      name: "Ethereum",
      market_data: {
        current_price: {
          usd: 3025.67,
        },
        price_change_percentage_24h: -1.23,
        price_change_percentage_7d: 3.45,
        price_change_percentage_30d: -2.34,
        market_cap: {
          usd: 365789012345,
        },
        total_volume: {
          usd: 23456789012,
        },
        high_24h: {
          usd: 3100,
        },
        low_24h: {
          usd: 2950,
        },
      },
    },
  };

  return cryptoDetails[id] || {
    id,
    symbol: id.substring(0, 3),
    name: id.charAt(0).toUpperCase() + id.slice(1),
    market_data: {
      current_price: {
        usd: 1000 + Math.random() * 1000,
      },
      price_change_percentage_24h: Math.random() * 10 - 5,
      price_change_percentage_7d: Math.random() * 20 - 10,
      price_change_percentage_30d: Math.random() * 30 - 15,
      market_cap: {
        usd: 1000000000 + Math.random() * 10000000000,
      },
      total_volume: {
        usd: 100000000 + Math.random() * 1000000000,
      },
      high_24h: {
        usd: 1100 + Math.random() * 1000,
      },
      low_24h: {
        usd: 900 + Math.random() * 1000,
      },
    },
  };
}

function generateRandomPrices(count: number, min: number, max: number): number[] {
  const prices: number[] = [];
  let currentPrice = min + Math.random() * (max - min);
  
  for (let i = 0; i < count; i++) {
    // Random walk with some volatility
    const change = currentPrice * (Math.random() * 0.04 - 0.02);
    currentPrice += change;
    
    // Ensure price stays within bounds
    if (currentPrice < min) currentPrice = min + Math.random() * (max - min) * 0.1;
    if (currentPrice > max) currentPrice = max - Math.random() * (max - min) * 0.1;
    
    prices.push(currentPrice);
  }
  
  return prices;
}
