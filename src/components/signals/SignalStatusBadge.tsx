
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface SignalStatusBadgeProps {
  status: "active" | "completed";
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
