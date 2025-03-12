import React, { useState } from 'react';
import arrowDownIcon from '../../assets/icons/CaretDown.svg';
import addIcon from '../../assets/icons/PlusCircle.svg';

const Header = ({ handleButton, onSearch, onPriorityFilter, selectedPriority }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const priorities = ['All', 'High', 'Medium', 'Low'];

  return (
    <header className="flex p-3 justify-between items-center self-strech">
      <h1 className="font-title">T-ALIGN</h1>

      <div className="flex w-auto p-0.75 items-center gap-3">
        <input
          placeholder="Search Tasks..."
          className="flex p-2.5 border-1 rounded-xl bg-charcoal border-steel"
          onChange={(e) => onSearch(e.target.value)}
        />
        <div className="relative">
          <button 
            className="flex p-2.5 bg-charcoal border-1 border-steel rounded-xl text-white gap-3 cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedPriority} <img src={arrowDownIcon} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-full z-10">
              <ul className="bg-charcoal border-1 border-steel rounded-xl shadow-lg">
                {priorities.map((priority) => (
                  <li
                    key={priority}
                    className="p-2.5 hover:bg-zinc-800 cursor-pointer"
                    onClick={() => {
                      onPriorityFilter(priority);
                      setIsDropdownOpen(false);
                    }}
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
          className="flex p-2.5 bg-steel-blue rounded-xl text-white gap-3 cursor-pointer hover:bg-steel-blue-dark"
        >
          Add Task
          <img src={addIcon} />
        </button>
      </div>
    </header>
  );
};

export default Header;
