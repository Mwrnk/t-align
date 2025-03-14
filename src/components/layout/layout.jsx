import React, { useState, useEffect } from 'react';
import { Settings, Sun, Moon, LayoutGrid, List } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

const Layout = ({ children }) => {
  // Initialize state from localStorage
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [compactMode, setCompactMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('compactMode') === 'true';
    }
    return false;
  });
  const [currentTheme, setCurrentTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });
  const [motionReduced, setMotionReduced] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('motionReduced') === 'true';
    }
    return false;
  });
  const [sortingMethod, setSortingMethod] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sortingMethod') || 'date';
    }
    return 'date';
  });
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('viewMode') || 'board';
    }
    return 'board';
  });

  // Apply compact mode effect
  useEffect(() => {
    localStorage.setItem('compactMode', compactMode);
    document.body.classList.toggle('compact-mode', compactMode);
  }, [compactMode]);

  // Apply theme effect
  useEffect(() => {
    localStorage.setItem('theme', currentTheme);
    document.documentElement.classList.toggle('dark', currentTheme === 'dark');
    document.documentElement.classList.toggle('light', currentTheme === 'light');
  }, [currentTheme]);

  // Apply reduced motion effect
  useEffect(() => {
    localStorage.setItem('motionReduced', motionReduced);
    document.body.classList.toggle('reduce-motion', motionReduced);
  }, [motionReduced]);

  // Save other settings to localStorage
  useEffect(() => {
    localStorage.setItem('sortingMethod', sortingMethod);
    localStorage.setItem('viewMode', viewMode);
  }, [sortingMethod, viewMode]);

  const handleCompactModeChange = (checked) => {
    setCompactMode(checked);
    toast.info(`Compact mode ${checked ? 'enabled' : 'disabled'}`);
  };

  const handleThemeChange = (checked) => {
    setCurrentTheme(checked ? 'dark' : 'light');
    toast.info(`${checked ? 'Dark' : 'Light'} mode enabled`);
  };

  const handleMotionReducedChange = (checked) => {
    setMotionReduced(checked);
    toast.info(`Animations ${checked ? 'reduced' : 'enabled'}`);
  };

  const handleSortingMethodChange = (value) => {
    setSortingMethod(value);
    toast.info(`Default sorting set to ${value}`);
  };

  const handleViewModeChange = (value) => {
    setViewMode(value);
    toast.info(`View mode set to ${value}`);
  };

  const ThemeIcon = currentTheme === 'dark' ? Moon : Sun;

  return (
    <div className="min-h-screen max-w-full bg-background text-foreground flex flex-col overflow-hidden">
      <div className="flex-grow flex flex-col overflow-auto">{children}</div>

      {/* Responsive footer */}
      <footer className="p-4 flex justify-between items-center text-sm text-muted-foreground bg-muted">
        <p>T-Align</p>
        
        <div className="flex items-center gap-4">
          {/* Quick theme toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCurrentTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            className="rounded-full h-8 w-8 p-0"
          >
            <ThemeIcon className="h-4 w-4" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 hover:text-foreground transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
        </div>
      </footer>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Application Settings</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="appearance" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="behavior">Behavior</TabsTrigger>
            </TabsList>

            <TabsContent value="appearance" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="theme-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark theme
                  </p>
                </div>
                <Switch 
                  id="theme-mode" 
                  checked={currentTheme === 'dark'}
                  onCheckedChange={handleThemeChange}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="compact-mode">Compact Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Reduces spacing and component sizes
                  </p>
                </div>
                <Switch 
                  id="compact-mode" 
                  checked={compactMode}
                  onCheckedChange={handleCompactModeChange}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reduced-motion">Reduce Animations</Label>
                  <p className="text-sm text-muted-foreground">
                    For better accessibility
                  </p>
                </div>
                <Switch 
                  id="reduced-motion" 
                  checked={motionReduced}
                  onCheckedChange={handleMotionReducedChange}
                />
              </div>
            </TabsContent>

            <TabsContent value="behavior" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sorting-method">Default Sorting Method</Label>
                  <p className="text-sm text-muted-foreground">
                    How tasks are sorted by default
                  </p>
                </div>
                <Select 
                  id="sorting-method"
                  value={sortingMethod}
                  onValueChange={handleSortingMethodChange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select sorting" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date (newest first)</SelectItem>
                    <SelectItem value="priority">Priority (high to low)</SelectItem>
                    <SelectItem value="alphabetical">Alphabetical (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="view-mode">Default View Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    How tasks are displayed
                  </p>
                </div>
                <Select 
                  id="view-mode"
                  value={viewMode}
                  onValueChange={handleViewModeChange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="board">
                      <div className="flex items-center">
                        <LayoutGrid className="mr-2 h-4 w-4" />
                        <span>Board View</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="list">
                      <div className="flex items-center">
                        <List className="mr-2 h-4 w-4" />
                        <span>List View</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Layout;
