import React from 'react';
import arrowDownIcon from '../../assets/icons/CaretDown.svg';
import addIcon from '../../assets/icons/PlusCircle.svg';
const Header = ({ handleButton }) => {
  return (
    <header className="flex p-3 justify-between items-center self-strech">
      <h1 className="font-title">T-ALIGN</h1>

      <div className="flex w-auto p-0.75 items-center gap-3">
        <input
          placeholder="Search Tasks..."
          className="flex p-2.5 border-1 rounded-xl bg-charcoal border-steel"
        />
        <button className="flex p-2.5 bg-charcoal border-1 border-steel rounded-xl text-white gap-3 cursor-pointer">
          All Priorities <img src={arrowDownIcon} />
        </button>
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
