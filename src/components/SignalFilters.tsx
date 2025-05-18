
import React from "react";
import { MarketType, TimeFrame } from "@/types/market";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SignalFiltersProps {
  selectedMarketType: MarketType;
  setSelectedMarketType: (type: MarketType) => void;
  timeFrame: TimeFrame;
  setTimeFrame: (timeFrame: TimeFrame) => void;
}

const SignalFilters: React.FC<SignalFiltersProps> = ({
  selectedMarketType,
  setSelectedMarketType,
  timeFrame,
  setTimeFrame,
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Signal Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Market Type</h4>
          <Tabs value={selectedMarketType} onValueChange={(v) => setSelectedMarketType(v as MarketType)} className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="crypto">Crypto</TabsTrigger>
              <TabsTrigger value="forex">Forex</TabsTrigger>
              <TabsTrigger value="commodities">Commodities</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Time Frame</h4>
          <Tabs value={timeFrame} onValueChange={(v) => setTimeFrame(v as TimeFrame)} className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="short">Short</TabsTrigger>
              <TabsTrigger value="medium">Medium</TabsTrigger>
              <TabsTrigger value="long">Long</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="pt-2">
          <h4 className="text-sm font-medium mb-2">API Credentials</h4>
          <ApiCredentialsForm />
        </div>
      </CardContent>
    </Card>
  );
};

// API Credentials Form Component
const ApiCredentialsForm: React.FC = () => {
  const [apiKey, setApiKey] = React.useState("");
  const [apiSecret, setApiSecret] = React.useState("");
  const [isSaved, setIsSaved] = React.useState(false);

  React.useEffect(() => {
    // Load saved credentials if they exist
    const { key, secret } = require("@/services/signalService").getApiCredentials();
    if (key) setApiKey(key);
    if (secret) setApiSecret(secret);
    if (key && secret) setIsSaved(true);
  }, []);

  const handleSave = () => {
    if (apiKey && apiSecret) {
      require("@/services/signalService").saveApiCredentials(apiKey, apiSecret);
      setIsSaved(true);
    }
  };

  return (
    <div className="space-y-2">
      <div>
        <label htmlFor="apiKey" className="text-sm text-muted-foreground">
          API Key
        </label>
        <input
          id="apiKey"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full p-2 text-sm rounded-md border border-border bg-background"
          placeholder="Enter API Key"
        />
      </div>
      
      <div>
        <label htmlFor="apiSecret" className="text-sm text-muted-foreground">
          API Secret
        </label>
        <input
          id="apiSecret"
          type="password"
          value={apiSecret}
          onChange={(e) => setApiSecret(e.target.value)}
          className="w-full p-2 text-sm rounded-md border border-border bg-background"
          placeholder="Enter API Secret"
        />
      </div>
      
      <button
        onClick={handleSave}
        className="w-full bg-primary text-primary-foreground rounded-md py-1.5 text-sm font-medium"
      >
        {isSaved ? "Credentials Saved" : "Save Credentials"}
      </button>
    </div>
  );
};

export default SignalFilters;
