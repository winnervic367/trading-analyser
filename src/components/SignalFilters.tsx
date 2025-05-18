
import React, { useState } from "react";
import { MarketType, TimeFrame } from "@/types/market";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

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
  const [useUtcTime, setUseUtcTime] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(70);

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
        
        <div className="flex items-center justify-between">
          <Label htmlFor="utc-time" className="text-sm font-medium">UTC Time</Label>
          <Switch
            id="utc-time"
            checked={useUtcTime}
            onCheckedChange={setUseUtcTime}
          />
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Confidence Threshold: {confidenceThreshold}%</h4>
          <input
            type="range"
            min="50"
            max="95"
            value={confidenceThreshold}
            onChange={(e) => setConfidenceThreshold(parseInt(e.target.value))}
            className="w-full"
          />
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
      toast({
        title: "Credentials Saved",
        description: "Your API credentials have been securely saved.",
      });
    } else {
      toast({
        title: "Error",
        description: "Please provide both API Key and Secret",
        variant: "destructive"
      });
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
        {isSaved ? "Update Credentials" : "Save Credentials"}
      </button>
    </div>
  );
};

export default SignalFilters;
