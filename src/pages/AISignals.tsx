
import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { CryptoCurrency } from "@/services/cryptoService";
import SignalsList from "@/components/SignalsList";
import SignalDetails from "@/components/SignalDetails";
import SignalFilters from "@/components/SignalFilters";
import { Market, PredictionSignal } from "@/types/market";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SignalsTable from "@/components/SignalsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AISignals = () => {
  const [selectedMarketType, setSelectedMarketType] = useState<"crypto" | "forex" | "commodities">("crypto");
  const [selectedAsset, setSelectedAsset] = useState<CryptoCurrency | null>(null);
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null);
  const [timeFrame, setTimeFrame] = useState<"short" | "medium" | "long">("medium");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header title="AI Signals" />
        
        <main className="flex-1 overflow-y-auto p-4 pb-8 custom-scrollbar">
          <div className="mb-4">
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "table" | "cards")} className="w-64">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="table">Table View</TabsTrigger>
                <TabsTrigger value="cards">Card View</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {viewMode === "table" ? (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-72">
                  <SignalFilters
                    selectedMarketType={selectedMarketType}
                    setSelectedMarketType={setSelectedMarketType}
                    timeFrame={timeFrame}
                    setTimeFrame={setTimeFrame}
                  />
                </div>
                <div className="flex-1">
                  <SignalsTable 
                    marketType={selectedMarketType}
                    timeFrame={timeFrame}
                    onSelectSignal={(id) => setSelectedSignalId(id)}
                  />
                </div>
              </div>
              
              {selectedSignalId && (
                <SignalDetails
                  signalId={selectedSignalId}
                  assetId={selectedAsset?.id || "bitcoin"}
                  marketType={selectedMarketType}
                />
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div className="col-span-1 xl:col-span-2 space-y-4">
                <SignalDetails
                  signalId={selectedSignalId}
                  assetId={selectedAsset?.id || "bitcoin"}
                  marketType={selectedMarketType}
                />
              </div>
              
              <div className="col-span-1 space-y-4">
                <SignalFilters
                  selectedMarketType={selectedMarketType}
                  setSelectedMarketType={setSelectedMarketType}
                  timeFrame={timeFrame}
                  setTimeFrame={setTimeFrame}
                />
                <SignalsList
                  marketType={selectedMarketType}
                  timeFrame={timeFrame}
                  onSelectSignal={(id) => setSelectedSignalId(id)}
                  selectedSignalId={selectedSignalId}
                  onSelectAsset={(asset) => setSelectedAsset(asset)}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AISignals;
