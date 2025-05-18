
import React, { useEffect, useState } from "react";
import { MarketType, PredictionSignal, TimeFrame } from "@/types/market";
import { fetchFilteredSignals } from "@/services/signalService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SignalFilterBadges from "./signals/SignalFilterBadges";
import SignalTableRow from "./signals/SignalTableRow";

interface SignalsTableProps {
  marketType: MarketType;
  timeFrame: TimeFrame;
  onSelectSignal: (id: string) => void;
}

const SignalsTable: React.FC<SignalsTableProps> = ({
  marketType,
  timeFrame,
  onSelectSignal,
}) => {
  const [signals, setSignals] = useState<PredictionSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "win" | "loss">("all");

  useEffect(() => {
    const loadSignals = async () => {
      setLoading(true);
      try {
        const data = await fetchFilteredSignals(marketType, timeFrame);
        setSignals(data);
      } catch (error) {
        console.error("Error loading signals:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSignals();
  }, [marketType, timeFrame]);

  const filteredSignals = signals.filter(signal => {
    if (filter === "all") return true;
    if (filter === "win") return signal.result === "profit";
    if (filter === "loss") return signal.result === "loss";
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-4 border-b border-border">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Trading Signals</h3>
          <SignalFilterBadges 
            activeFilter={filter}
            onFilterChange={setFilter}
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Market Type</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead>Direction</TableHead>
              <TableHead>Entry Price</TableHead>
              <TableHead>Exit Price</TableHead>
              <TableHead>Entry Time</TableHead>
              <TableHead>Exit Time</TableHead>
              <TableHead>Probability</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Chart</TableHead>
              <TableHead>Share</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSignals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-8">
                  No signals found for the selected filters
                </TableCell>
              </TableRow>
            ) : (
              filteredSignals.map((signal) => (
                <SignalTableRow 
                  key={signal.id} 
                  signal={signal} 
                  onSelectSignal={onSelectSignal} 
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SignalsTable;
