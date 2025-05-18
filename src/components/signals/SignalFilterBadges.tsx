
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface SignalFilterBadgesProps {
  activeFilter: "all" | "win" | "loss";
  onFilterChange: (filter: "all" | "win" | "loss") => void;
}

const SignalFilterBadges: React.FC<SignalFilterBadgesProps> = ({
  activeFilter,
  onFilterChange
}) => {
  return (
    <div className="flex gap-2">
      <Badge 
        variant={activeFilter === "all" ? "default" : "outline"} 
        className="cursor-pointer"
        onClick={() => onFilterChange("all")}
      >
        All
      </Badge>
      <Badge 
        variant={activeFilter === "win" ? "default" : "outline"} 
        className="cursor-pointer"
        onClick={() => onFilterChange("win")}
      >
        Win
      </Badge>
      <Badge 
        variant={activeFilter === "loss" ? "default" : "outline"} 
        className="cursor-pointer"
        onClick={() => onFilterChange("loss")}
      >
        Loss
      </Badge>
    </div>
  );
};

export default SignalFilterBadges;
