
import React from "react";
import { Link } from "react-router-dom";
import { BarChart3, Compass, Settings, Sparkles, TrendingUp, BookOpen, History, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarItem = {
  icon: LucideIcon;
  label: string;
  href: string;
  active?: boolean;
};

const Sidebar = () => {
  const menuItems: SidebarItem[] = [
    {
      icon: TrendingUp,
      label: "Market",
      href: "/",
      active: true,
    },
    {
      icon: BarChart3,
      label: "Analysis",
      href: "/analysis",
    },
    {
      icon: Sparkles,
      label: "AI Insights",
      href: "/ai-insights",
    },
    {
      icon: Compass,
      label: "Discover",
      href: "/discover",
    },
    {
      icon: BookOpen,
      label: "News",
      href: "/news",
    },
    {
      icon: History,
      label: "History",
      href: "/history",
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/settings",
    },
  ];

  return (
    <aside className="w-16 lg:w-64 shrink-0 border-r border-border h-screen sticky top-0 bg-sidebar">
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-center justify-center lg:justify-start mb-8 mt-2">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md bg-gradient-trading flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold hidden lg:block">TradeMind AI</h1>
          </div>
        </div>
        
        <nav className="space-y-1 flex-1">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex items-center py-3 px-3 rounded-md text-sm transition-colors",
                "hover:bg-sidebar-accent",
                item.active
                  ? "bg-sidebar-accent text-primary font-medium"
                  : "text-sidebar-foreground"
              )}
            >
              <item.icon className="h-5 w-5 mr-3 shrink-0" />
              <span className="hidden lg:inline-block">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto">
          <div className="hidden lg:block rounded-lg bg-sidebar-accent p-4 text-center">
            <p className="text-xs text-muted-foreground mb-2">
              Upgrade to Pro for advanced AI predictions
            </p>
            <button className="w-full bg-gradient-trading hover:opacity-90 text-white rounded-md py-1.5 text-sm font-medium transition-opacity">
              Upgrade Now
            </button>
          </div>
          
          <div className="flex items-center lg:hidden justify-center mt-6">
            <button className="h-8 w-8 rounded-md bg-gradient-trading flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
