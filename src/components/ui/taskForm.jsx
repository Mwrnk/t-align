import React from 'react';
import { useState, useEffect } from 'react';
import arrowDownIcon from '../../assets/icons/CaretDown.svg';

export const TaskForm = ({ isOpen, onClose, onAddTask, onEditTask, task }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');

  // Populate form when editing a task
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'Medium');
    } else {
      // Reset form when not editing
      setTitle('');
      setDescription('');
      setPriority('Medium');
    }
  }, [task]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim()) return;

    const updatedTask = {
      id: task ? task.id : Date.now().toString(), // Keep original ID when editing
      title,
      description,
      priority,
      status: task ? task.status : 'Todo',
      createdAt: task ? task.createdAt : new Date().toLocaleDateString(),
    };

    if (task && typeof onEditTask === 'function') {
      onEditTask(updatedTask);
    } else if (typeof onAddTask === 'function') {
      onAddTask(updatedTask);
    } else {
      console.error('Neither onEditTask nor onAddTask is a valid function');
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-charcoal/50 flex items-center justify-center drop-shadow-2xl">
      <div className="bg-zinc-800 p-6 rounded-xl flex flex-col gap-4 w-96">
        <h2 className="text-xl font-bold text-center">
          {task ? 'Edit Task' : 'Add New Task'}
        </h2>
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
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="p-2.5 bg-charcoal border-1 border-steel rounded-xl text-white flex-1"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="p-2.5 bg-steel-blue rounded-xl text-white hover:bg-steel-blue-dark flex-1"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
