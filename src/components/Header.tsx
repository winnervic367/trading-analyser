
import React from "react";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const isMobile = useIsMobile();

  return (
    <header className="flex items-center justify-between p-4 border-b border-border bg-background sticky top-0 z-10">
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        {!isMobile && (
          <p className="text-sm text-muted-foreground">
            Real-time trading intelligence powered by AI
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-9 w-9"
        >
          <Bell className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-9 w-9"
        >
          <User className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
