import React from 'react';
import { Button, Dropdown, Input } from '../ui';

const Header = () => {
  return (
    <header className="flex p-3 justify-between items-center self-strech">
      <h1 className="font-title">T-ALIGN</h1>

      <div className="flex w-auto p-0.75 items-center gap-3">
        <Input placeholder={'Search Tasks...'} />
        <Dropdown />
        <Button />
      </div>
    </header>
  );
};

export default Header;
