
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { SignalStatus } from "@/types/market";

interface SignalStatusBadgeProps {
  status: SignalStatus;
  result?: "profit" | "loss" | null;
}

const SignalStatusBadge: React.FC<SignalStatusBadgeProps> = ({
  status,
  result
}) => {
  if (status === "active") {
    return (
      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
        Active
      </Badge>
    );
  } else if (status === "invalidated") {
    return (
      <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
        Invalidated
      </Badge>
    );
  } else if (result === "profit") {
    return (
      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
        Win
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
        Loss
      </Badge>
    );
  }
};

export default SignalStatusBadge;
