
import React from 'react';
import { PredictionSignal } from "@/types/market";
import { TableCell, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { formatPrice } from "@/utils/formatters";
import SignalDirectionIndicator from "./SignalDirectionIndicator";
import SignalStatusBadge from "./SignalStatusBadge";
import SignalChartDialog from "./SignalChartDialog";
import SignalShareButtons from "./SignalShareButtons";

interface SignalTableRowProps {
  signal: PredictionSignal;
  onSelectSignal: (id: string) => void;
}

const SignalTableRow: React.FC<SignalTableRowProps> = ({
  signal,
  onSelectSignal
}) => {
  return (
    <TableRow 
      key={signal.id} 
      onClick={() => onSelectSignal(signal.id)} 
      className="cursor-pointer hover:bg-accent/10"
    >
      <TableCell className="whitespace-nowrap">
        {signal.marketType === "crypto" ? "Crypto" : 
          signal.marketType === "forex" ? "Forex" : "Commodities"}
      </TableCell>
      <TableCell className="whitespace-nowrap">
        <div className="flex items-center gap-2">
          {signal.image && (
            <img src={signal.image} alt={signal.assetSymbol} className="h-5 w-5" />
          )}
          {signal.assetSymbol}
        </div>
      </TableCell>
      <TableCell>
        <SignalDirectionIndicator direction={signal.direction} />
      </TableCell>
      <TableCell>{formatPrice(signal.entryPrice)}</TableCell>
      <TableCell>{formatPrice(signal.targetPrice)}</TableCell>
      <TableCell className="whitespace-nowrap">
        {format(new Date(signal.entryTime), "MMM dd, HH:mm")}
      </TableCell>
      <TableCell className="whitespace-nowrap">
        {signal.actualExitTime ? 
          format(new Date(signal.actualExitTime), "MMM dd, HH:mm") : 
          format(new Date(signal.expectedExitTime), "MMM dd, HH:mm")}
      </TableCell>
      <TableCell>
        <span className={signal.probability > 75 ? "text-green-500" : "text-amber-500"}>
          {signal.probability}%
        </span>
      </TableCell>
      <TableCell>
        <SignalStatusBadge 
          status={signal.status} 
          result={signal.result} 
        />
      </TableCell>
      <TableCell>
        <SignalChartDialog signal={signal} />
      </TableCell>
      <TableCell>
        <SignalShareButtons signal={signal} />
      </TableCell>
    </TableRow>
  );
};

export default SignalTableRow;
