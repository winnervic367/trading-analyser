
import React from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

const Settings = () => {
  const [loading, setLoading] = React.useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate saving delay
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Profile updated",
        description: "Your profile settings have been saved successfully."
      });
    }, 1000);
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate saving delay
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Notification preferences saved",
        description: "Your notification settings have been updated."
      });
    }, 1000);
  };

  const handleSaveAPI = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate saving delay
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "API settings updated",
        description: "Your API connections have been configured successfully."
      });
    }, 1000);
  };

  const handleSaveDisplay = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate saving delay
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Display settings saved",
        description: "Your dashboard appearance preferences have been updated."
      });
    }, 1000);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header title="Settings" />
        
        <main className="flex-1 overflow-y-auto p-4 pb-8 custom-scrollbar">
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList className="bg-background border">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="api">API Connections</TabsTrigger>
              <TabsTrigger value="display">Display</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>
                    Manage your account details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First name</Label>
                        <Input id="firstName" placeholder="John" defaultValue="Alex" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input id="lastName" placeholder="Doe" defaultValue="Morgan" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john@example.com" defaultValue="alex@example.com" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" placeholder="johndoe" defaultValue="alexmorgan" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="utc">
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                          <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                          <SelectItem value="cst">CST (Central Standard Time)</SelectItem>
                          <SelectItem value="mst">MST (Mountain Standard Time)</SelectItem>
                          <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Save changes"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Update your password
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    <Button type="button">Update password</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Configure how and when you receive alerts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveNotifications} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Email Notifications</h3>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-price-alerts">Price alerts</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive email notifications for price movements
                          </p>
                        </div>
                        <Switch id="email-price-alerts" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-sentiment">Sentiment shifts</Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified when market sentiment changes significantly
                          </p>
                        </div>
                        <Switch id="email-sentiment" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-news">Major news events</Label>
                          <p className="text-sm text-muted-foreground">
                            Alerts about significant news that might impact your assets
                          </p>
                        </div>
                        <Switch id="email-news" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-predictions">AI predictions</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications about AI-generated price predictions
                          </p>
                        </div>
                        <Switch id="email-predictions" defaultChecked />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Push Notifications</h3>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="push-price-alerts">Price alerts</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive push notifications for price movements
                          </p>
                        </div>
                        <Switch id="push-price-alerts" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="push-sentiment">Sentiment shifts</Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified when market sentiment changes significantly
                          </p>
                        </div>
                        <Switch id="push-sentiment" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="push-news">Major news events</Label>
                          <p className="text-sm text-muted-foreground">
                            Alerts about significant news that might impact your assets
                          </p>
                        </div>
                        <Switch id="push-news" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="push-predictions">AI predictions</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications about AI-generated price predictions
                          </p>
                        </div>
                        <Switch id="push-predictions" />
                      </div>
                    </div>
                    
                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Save preferences"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="api" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>API Connections</CardTitle>
                  <CardDescription>
                    Connect to cryptocurrency exchanges and data providers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveAPI} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Exchange Connections</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="binance-api">Binance API Key</Label>
                          <Input id="binance-api" type="password" placeholder="Your Binance API key" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="binance-secret">Binance API Secret</Label>
                          <Input id="binance-secret" type="password" placeholder="Your Binance API secret" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="binance-trade" />
                          <Label htmlFor="binance-trade">Allow trading (requires trading permissions)</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Data Provider Connections</h3>
                      <div className="space-y-2">
                        <Label htmlFor="coinapi-key">CoinAPI Key</Label>
                        <Input id="coinapi-key" type="password" placeholder="Your CoinAPI key" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="data-frequency">Data Update Frequency</Label>
                        <Select defaultValue="normal">
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High (10 seconds)</SelectItem>
                            <SelectItem value="normal">Normal (30 seconds)</SelectItem>
                            <SelectItem value="low">Low (60 seconds)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Save connections"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="display" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Display Settings</CardTitle>
                  <CardDescription>
                    Customize your dashboard appearance and layout
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveDisplay} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Appearance</h3>
                      <div className="space-y-2">
                        <Label htmlFor="theme">Theme</Label>
                        <Select defaultValue="dark">
                          <SelectTrigger>
                            <SelectValue placeholder="Select theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="density">Display Density</Label>
                        <Select defaultValue="normal">
                          <SelectTrigger>
                            <SelectValue placeholder="Select density" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="compact">Compact</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="comfortable">Comfortable</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Chart Preferences</h3>
                      <div className="space-y-2">
                        <Label htmlFor="default-timeframe">Default Timeframe</Label>
                        <Select defaultValue="24h">
                          <SelectTrigger>
                            <SelectValue placeholder="Select timeframe" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1h">1 Hour</SelectItem>
                            <SelectItem value="24h">24 Hours</SelectItem>
                            <SelectItem value="7d">7 Days</SelectItem>
                            <SelectItem value="30d">30 Days</SelectItem>
                            <SelectItem value="90d">90 Days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch id="show-indicators" defaultChecked />
                        <Label htmlFor="show-indicators">Show technical indicators by default</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch id="show-predictions" defaultChecked />
                        <Label htmlFor="show-predictions">Show AI predictions on charts</Label>
                      </div>
                    </div>
                    
                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Save display settings"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Settings;
