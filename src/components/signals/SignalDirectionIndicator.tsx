
import React from 'react';
import { ArrowUp, ArrowDown } from "lucide-react";

interface SignalDirectionIndicatorProps {
  direction: "buy" | "sell";
}

const SignalDirectionIndicator: React.FC<SignalDirectionIndicatorProps> = ({
  direction
}) => {
  return direction === "buy" ? (
    <span className="flex items-center text-green-500">
      <ArrowUp className="h-4 w-4 mr-1" /> Buy
    </span>
  ) : (
    <span className="flex items-center text-red-500">
      <ArrowDown className="h-4 w-4 mr-1" /> Sell
    </span>
  );
};

export default SignalDirectionIndicator;
