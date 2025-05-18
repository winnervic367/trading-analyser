
import React from 'react';
import { PredictionSignal } from "@/types/market";
import { Button } from "@/components/ui/button";
import { Share2, MessageCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { formatPrice } from "@/utils/formatters";

interface SignalShareButtonsProps {
  signal: PredictionSignal;
}

const SignalShareButtons: React.FC<SignalShareButtonsProps> = ({
  signal
}) => {
  const handleShare = (signal: PredictionSignal, platform: "telegram" | "whatsapp") => {
    const message = `🔮 AI Trade Signal
Market: ${signal.marketType.charAt(0).toUpperCase() + signal.marketType.slice(1)}
Pair: ${signal.assetSymbol}
Entry: ${formatPrice(signal.entryPrice)}
Exit: ${formatPrice(signal.targetPrice)}
Entry Time: ${format(new Date(signal.entryTime), "MMM dd, yyyy HH:mm")} UTC
Confidence: ${signal.probability}%
Risk/Reward: ${signal.riskReward}
Direction: ${signal.direction.toUpperCase()}
View Chart 📊 [${window.location.origin}/signals/${signal.id}]`;

    let url = "";
    if (platform === "telegram") {
      url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(message)}`;
    } else if (platform === "whatsapp") {
      url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    }

    window.open(url, "_blank");
    toast({
      title: "Share Link Created",
      description: `Signal shared via ${platform === "whatsapp" ? "WhatsApp" : "Telegram"}`,
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8" 
        onClick={(e) => {
          e.stopPropagation();
          handleShare(signal, "telegram");
        }}
      >
        <MessageCircle className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8" 
        onClick={(e) => {
          e.stopPropagation();
          handleShare(signal, "whatsapp");
        }}
      >
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SignalShareButtons;
