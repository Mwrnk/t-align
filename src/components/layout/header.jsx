import React, { useState } from 'react';
import { Plus, Search, Menu, X, LayoutGrid, List, Filter, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const Header = ({ handleButton, onSearch, onPriorityFilter, selectedPriority, onViewChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const viewMode = localStorage.getItem('viewMode') || 'board';
  const priorities = ['All', 'High', 'Medium', 'Low'];

  // Gerenciamento de search
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  // Gerenciamento de filtros
  const handlePriorityChange = (value) => {
    onPriorityFilter(value);
    toast.info(`Filtered by ${value} priority`);
  };

  // Gerenciamento de visualização
  const handleViewModeChange = (value) => {
    localStorage.setItem('viewMode', value);
    if (onViewChange) {
      onViewChange(value);
      toast.info(`View changed to ${value === 'board' ? 'Board' : 'List'} view`);
    }
  };

  // Alternar menu móvel
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="w-full">
      {/* Header Desktop */}
      <div className="hidden md:flex items-center justify-between w-full">
        {/* Logo e título */}
        <div className="flex items-center gap-4">
          <h1 className="font-title text-xl tracking-wider text-primary">T-ALIGN</h1>
          
          {/* Controles de visualização */}
          <Tabs defaultValue={viewMode} onValueChange={handleViewModeChange} className="mr-2">
            <TabsList className="grid w-[180px] grid-cols-2">
              <TabsTrigger value="board" className="flex items-center justify-center gap-1.5">
                <LayoutGrid className="h-4 w-4" />
                <span>Board</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center justify-center gap-1.5">
                <List className="h-4 w-4" />
                <span>List</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Área central com search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              className={cn(
                "pl-9 w-full border-border",
                "bg-background/30 focus:bg-background/50", 
                "transition-colors focus-visible:ring-1 focus-visible:ring-ring",
              )}
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleClearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Controles da direita */}
        <div className="flex items-center gap-3">
          {/* Dropdown de filtros */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Priority</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {priorities.map(priority => (
                <DropdownMenuItem 
                  key={priority}
                  className={cn(
                    "cursor-pointer flex items-center justify-between",
                    selectedPriority === priority && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => handlePriorityChange(priority)}
                >
                  {priority}
                  {selectedPriority === priority && (
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor"/>
                    </svg>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Botão de adicionar tarefa */}
          <Button onClick={handleButton} className="gap-1.5">
            <Plus className="h-4 w-4" />
            <span>Add Task</span>
          </Button>
        </div>
      </div>

      {/* Header Mobile - Simplificado e mais focado */}
      <div className="md:hidden flex flex-col">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <h1 className="font-title text-lg tracking-wider text-primary">T-ALIGN</h1>
          
          {/* Controles móveis */}
          <div className="flex items-center gap-2">
            {/* Botão de adicionar */}
            <Button 
              variant="default"
              size="sm"
              onClick={handleButton}
              className="h-9 px-3"
            >
              <Plus className="h-4 w-4" />
            </Button>
            
            {/* Botão de filtro */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Priority</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {priorities.map(priority => (
                  <DropdownMenuItem 
                    key={priority}
                    className={cn(
                      "cursor-pointer flex items-center justify-between",
                      selectedPriority === priority && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => handlePriorityChange(priority)}
                  >
                    {priority}
                    {selectedPriority === priority && (
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor"/>
                      </svg>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Menu principal */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleMobileMenu}
              className="h-9 w-9"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        {/* Barra de pesquisa sempre visível no mobile */}
        <div className="mt-3 mb-1">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              className={cn(
                "pl-9 w-full h-9 border-border",
                "bg-background/30 focus:bg-background/50", 
                "transition-colors focus-visible:ring-1 focus-visible:ring-ring",
              )}
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleClearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Menu expandido */}
        {isMobileMenuOpen && (
          <div className="mt-3 border-t border-border pt-3 pb-1 animate-in slide-in-from-top duration-200">
            {/* Controles de visualização */}
            <div className="mb-3">
              <Tabs defaultValue={viewMode} onValueChange={handleViewModeChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="board" className="flex items-center justify-center gap-1.5">
                    <LayoutGrid className="h-4 w-4" />
                    <span>Board</span>
                  </TabsTrigger>
                  <TabsTrigger value="list" className="flex items-center justify-center gap-1.5">
                    <List className="h-4 w-4" />
                    <span>List</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
