import React from 'react';
import { useState } from 'react';
import arrowDownIcon from '../../assets/icons/CaretDown.svg';

export const TaskForm = ({ isOpen, onClose, onAddTask }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim()) return; // Don't save empty tasks

    const newTask = {
      id: Date.now().toString(), // Simple unique ID
      title,
      description,
      priority,
      status: 'Todo', // Default status
      createdAt: new Date().toLocaleDateString(),
    };

    onAddTask(newTask);

    // Reset form
    setTitle('');
    setDescription('');
    setPriority('Medium');

    // Close modal
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-charcoal/50 flex items-center justify-center drop-shadow-2xl">
      <div className="bg-zinc-800 p-6 rounded-xl flex flex-col gap-4 w-96">
        <input
          placeholder="Task title"
          className="p-2.5 border-1 rounded-xl bg-charcoal border-steel"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <textarea
          placeholder="Task description"
          className="p-2.5 border-1 rounded-xl bg-charcoal border-steel"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />
        <button
          className="flex flex-row justify-between items-center p-2.5 bg-charcoal border-1 border-steel rounded-xl text-white w-full relative"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {priority}
          <img src={arrowDownIcon} />
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-full z-10">
              <ul className="bg-charcoal border-1 border-steel rounded-xl w-full">
                <li
                  className="p-2.5 hover:bg-zinc-800 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPriority('High');
                    setIsDropdownOpen(false);
                  }}
                >
                  High
                </li>
                <li
                  className="p-2.5 hover:bg-zinc-800 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPriority('Medium');
                    setIsDropdownOpen(false);
                  }}
                >
                  Medium
                </li>
                <li
                  className="p-2.5 hover:bg-zinc-800 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPriority('Low');
                    setIsDropdownOpen(false);
                  }}
                >
                  Low
                </li>
              </ul>
            </div>
          )}
        </button>
        <button
          onClick={handleSave}
          className="p-2.5 bg-steel-blue rounded-xl text-white hover:bg-steel-blue-dark"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default TaskForm;
