import React, { useState } from 'react';
import arrowDownIcon from '../../assets/icons/CaretDown.svg';
import addIcon from '../../assets/icons/PlusCircle.svg';
import searchIcon from '../../assets/icons/MagnifyingGlass.svg';
import menuIcon from '../../assets/icons/List.svg';

const Header = ({ handleButton, onSearch, onPriorityFilter, selectedPriority }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const priorities = ['All', 'High', 'Medium', 'Low'];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <header className="bg-charcoal shadow-md z-10">
      {/* Desktop Header */}
      <div className="hidden md:flex p-3 justify-between items-center">
        <h1 className="font-title text-xl">T-ALIGN</h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              placeholder="Search Tasks..."
              className="flex p-2.5 border-1 rounded-xl bg-charcoal border-steel min-w-[200px]"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button 
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                ×
              </button>
            )}
          </div>
          
          <div className="relative">
            <button 
              className="flex p-2.5 bg-charcoal border-1 border-steel rounded-xl text-white gap-3 cursor-pointer items-center"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="listbox"
            >
              {selectedPriority} <img src={arrowDownIcon} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} alt="Toggle dropdown" />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-full z-20">
                <ul 
                  className="bg-charcoal border-1 border-steel rounded-xl shadow-lg"
                  role="listbox"
                  aria-label="Priority options"
                >
                  {priorities.map((priority) => (
                    <li
                      key={priority}
                      className={`p-2.5 hover:bg-zinc-800 cursor-pointer ${priority === selectedPriority ? 'bg-zinc-700' : ''}`}
                      onClick={() => {
                        onPriorityFilter(priority);
                        setIsDropdownOpen(false);
                      }}
                      role="option"
                      aria-selected={priority === selectedPriority}
                    >
                      {priority}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <button
            onClick={handleButton}
            className="flex p-2.5 bg-steel-blue rounded-xl text-white gap-3 cursor-pointer hover:bg-steel-blue-dark items-center"
          >
            Add Task
            <img src={addIcon} alt="Add task" />
          </button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden">
        <div className="flex p-3 justify-between items-center">
          <h1 className="font-title text-lg">T-ALIGN</h1>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleButton}
              className="p-2 bg-steel-blue rounded-xl text-white flex items-center justify-center"
              aria-label="Add task"
            >
              <img src={addIcon} alt="Add task" className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 bg-charcoal border-1 border-steel rounded-xl text-white"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle menu"
            >
              <img src={menuIcon} alt="Menu" className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Mobile expanded menu */}
        {isMobileMenuOpen && (
          <div className="p-3 bg-zinc-800 border-t border-steel animate-fadeIn">
            <div className="flex flex-col gap-3">
              <div className="relative flex items-center">
                <img src={searchIcon} alt="Search" className="absolute left-3 text-gray-400 w-5 h-5" />
                <input
                  placeholder="Search Tasks..."
                  className="flex p-2.5 pl-10 border-1 rounded-xl bg-charcoal border-steel w-full"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                {searchQuery && (
                  <button 
                    onClick={handleClearSearch}
                    className="absolute right-3 text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                )}
              </div>
              
              <div className="flex items-center justify-between border-1 border-steel rounded-xl p-2.5 bg-charcoal">
                <span className="text-sm text-gray-300">Priority:</span>
                <div className="flex gap-2">
                  {priorities.map((priority) => (
                    <button
                      key={priority}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        priority === selectedPriority 
                          ? 'bg-steel-blue text-white' 
                          : 'bg-zinc-700 text-gray-300'
                      }`}
                      onClick={() => onPriorityFilter(priority)}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
