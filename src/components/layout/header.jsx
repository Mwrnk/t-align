import React from 'react';

const Header = () => {
  return (
    <header className="font-bold text-2xl text-white bg-blue-500 p-4">
      <h1>Task App</h1>

      <div className="header__links">
        <a href="/">Home</a>
        <a href="/tasks">Tasks</a>
      </div>
    </header>
  );
};

export default Header;
