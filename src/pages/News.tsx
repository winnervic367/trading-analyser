
import React from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, ExternalLink, Bookmark, MessageCircle } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  source: string;
  publishedAt: string;
  url: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: number; // 1-10
  summary: string;
  imageUrl?: string;
  category: 'market' | 'regulation' | 'innovation' | 'company';
}

const News = () => {
  const [newsItems, setNewsItems] = React.useState<NewsItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<string>('all');

  React.useEffect(() => {
    // Simulating API fetch delay
    const timer = setTimeout(() => {
      setNewsItems(getMockNews());
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const filteredNews = filter === 'all' 
    ? newsItems
    : newsItems.filter(item => item.category === filter);

  const getSentimentClass = (sentiment: string) => {
    switch(sentiment) {
      case 'positive': return 'bg-green-500/20 text-green-500';
      case 'negative': return 'bg-red-500/20 text-red-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header title="News & Analysis" />
        
        <main className="flex-1 overflow-y-auto p-4 pb-8 custom-scrollbar">
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            <button 
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${filter === 'all' ? 'bg-accent' : 'bg-muted/30 hover:bg-accent/50'}`}
            >
              All News
            </button>
            <button 
              onClick={() => setFilter('market')}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${filter === 'market' ? 'bg-accent' : 'bg-muted/30 hover:bg-accent/50'}`}
            >
              Market Updates
            </button>
            <button 
              onClick={() => setFilter('regulation')}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${filter === 'regulation' ? 'bg-accent' : 'bg-muted/30 hover:bg-accent/50'}`}
            >
              Regulation
            </button>
            <button 
              onClick={() => setFilter('innovation')}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${filter === 'innovation' ? 'bg-accent' : 'bg-muted/30 hover:bg-accent/50'}`}
            >
              Innovation
            </button>
            <button 
              onClick={() => setFilter('company')}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${filter === 'company' ? 'bg-accent' : 'bg-muted/30 hover:bg-accent/50'}`}
            >
              Company News
            </button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                    <div className="h-20 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNews.map(item => (
                <Card key={item.id} className="overflow-hidden">
                  {item.imageUrl && (
                    <div className="h-48 overflow-hidden">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium bg-muted px-2 py-1 rounded">{item.source}</span>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${getSentimentClass(item.sentiment)}`}>
                        {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-base mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{item.summary}</p>
                    
                    <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(item.publishedAt)}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button className="hover:text-foreground">
                          <Bookmark className="h-4 w-4" />
                        </button>
                        <button className="hover:text-foreground">
                          <MessageCircle className="h-4 w-4" />
                        </button>
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="text-xs">
                        Market impact: 
                        <div className="w-full bg-muted h-1.5 rounded-full mt-1 overflow-hidden">
                          <div 
                            className={`h-full ${item.impact > 7 ? 'bg-red-500' : item.impact > 4 ? 'bg-amber-500' : 'bg-blue-500'}`}
                            style={{ width: `${item.impact * 10}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Mock data generator
const getMockNews = (): NewsItem[] => {
  return [
    {
      id: '1',
      title: 'Bitcoin Surges Past $65,000 as Major Institutional Investors Enter the Market',
      source: 'CryptoNews',
      publishedAt: '2025-05-16T14:30:00Z',
      url: '#',
      sentiment: 'positive',
      impact: 8,
      summary: 'Bitcoin has surged past $65,000, marking a 15% increase this week as major financial institutions announce new crypto investment products.',
      imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3J5cHRvY3VycmVuY3l8ZW58MHx8MHx8fDA%3D',
      category: 'market'
    },
    {
      id: '2',
      title: 'SEC Approves First Ethereum ETF, Opening Doors for Broader Crypto Investment',
      source: 'Bloomberg',
      publishedAt: '2025-05-15T09:45:00Z',
      url: '#',
      sentiment: 'positive',
      impact: 9,
      summary: 'In a landmark decision, the SEC has approved the first Ethereum ETF, potentially allowing millions of traditional investors access to the second-largest cryptocurrency.',
      imageUrl: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJsb2NrY2hhaW58ZW58MHx8MHx8fDA%3D',
      category: 'regulation'
    },
    {
      id: '3',
      title: 'Solana Network Experiences Major Outage, Transactions Halted for Six Hours',
      source: 'Decrypt',
      publishedAt: '2025-05-14T18:20:00Z',
      url: '#',
      sentiment: 'negative',
      impact: 7,
      summary: 'Solana has experienced its third major outage of the year, with transactions halted for approximately six hours due to a validator issue.',
      imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHNvbGFuYXxlbnwwfHwwfHx8MA%3D%3D',
      category: 'market'
    },
    {
      id: '4',
      title: 'New Layer-2 Solution Claims 100,000 TPS, Aims to Revolutionize Ethereum Scaling',
      source: 'CoinDesk',
      publishedAt: '2025-05-13T11:15:00Z',
      url: '#',
      sentiment: 'positive',
      impact: 6,
      summary: 'A new Ethereum Layer-2 solution has launched with claims of reaching 100,000 transactions per second in testnet environments, potentially solving Ethereum\'s scaling issues.',
      imageUrl: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZXRoZXJldW18ZW58MHx8MHx8fDA%3D',
      category: 'innovation'
    },
    {
      id: '5',
      title: 'China Softens Stance on Crypto, Exploring State-Backed Blockchain Solutions',
      source: 'Reuters',
      publishedAt: '2025-05-12T08:40:00Z',
      url: '#',
      sentiment: 'neutral',
      impact: 8,
      summary: 'Chinese officials have indicated a potential softening of the country\'s crypto ban, with plans to explore state-regulated and backed blockchain technology initiatives.',
      imageUrl: 'https://images.unsplash.com/photo-1574607383476-1b91639c5710?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGNoaW5hfGVufDB8fDB8fHww',
      category: 'regulation'
    },
    {
      id: '6',
      title: 'Coinbase Announces Expansion into Asian Markets with New Tokyo Office',
      source: 'Fortune',
      publishedAt: '2025-05-11T14:25:00Z',
      url: '#',
      sentiment: 'positive',
      impact: 5,
      summary: 'Cryptocurrency exchange giant Coinbase has announced plans to expand its operations in Asia with a new office in Tokyo and regulatory approval in Japan.',
      imageUrl: 'https://images.unsplash.com/photo-1622178936870-a62d99407536?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDZ8fHRva3lvfGVufDB8fDB8fHww',
      category: 'company'
    },
    {
      id: '7',
      title: 'DeFi Protocol Hacked for $30 Million, Exploiter Returns Half of Funds',
      source: 'The Block',
      publishedAt: '2025-05-10T16:50:00Z',
      url: '#',
      sentiment: 'negative',
      impact: 6,
      summary: 'A popular DeFi lending protocol was exploited for $30 million through a flash loan attack. In a surprising turn, the exploiter has returned 50% of the stolen funds.',
      imageUrl: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aGFja2VyfGVufDB8fDB8fHww',
      category: 'market'
    },
    {
      id: '8',
      title: 'NFT Market Shows Signs of Recovery with 40% Increase in Trading Volume',
      source: 'NFT News',
      publishedAt: '2025-05-09T10:35:00Z',
      url: '#',
      sentiment: 'positive',
      impact: 4,
      summary: 'After a prolonged downturn, the NFT market is showing strong signs of recovery with a 40% month-over-month increase in trading volume across major marketplaces.',
      imageUrl: 'https://images.unsplash.com/photo-1646483236148-6d3c136f7313?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bmZ0fGVufDB8fDB8fHww',
      category: 'market'
    },
    {
      id: '9',
      title: 'Central Bank Digital Currencies Will Be Interoperable, BIS Report States',
      source: 'Financial Times',
      publishedAt: '2025-05-08T13:15:00Z',
      url: '#',
      sentiment: 'neutral',
      impact: 7,
      summary: 'A new report from the Bank for International Settlements (BIS) states that central bank digital currencies (CBDCs) being developed globally will focus on cross-border interoperability.',
      imageUrl: 'https://images.unsplash.com/photo-1574789765352-57eae2f3b2c7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGJhbmt8ZW58MHx8MHx8fDA%3D',
      category: 'regulation'
    }
  ];
};

export default News;
