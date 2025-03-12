import React, { useState, useEffect } from 'react';
import arrowDownIcon from '../../assets/icons/CaretDown.svg';

const PriorityDropdown = ({ value, onChange, isOpen, setIsOpen }) => {
  const priorities = ['High', 'Medium', 'Low'];
  
  return (
    <div className="w-full relative">
      <button
        type="button"
        className="flex flex-row justify-between items-center p-2.5 bg-charcoal border-1 border-steel rounded-xl text-white w-full transition-colors hover:bg-zinc-700"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select priority"
      >
        {value}
        <img src={arrowDownIcon} alt="Toggle dropdown" className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-1 w-full z-10"
          role="listbox"
          aria-label="Priority options"
        >
          <ul className="bg-charcoal border-1 border-steel rounded-xl w-full shadow-lg">
            {priorities.map((priority) => (
              <li
                key={priority}
                className="p-2.5 hover:bg-zinc-800 cursor-pointer transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(priority);
                  setIsOpen(false);
                }}
                role="option"
                aria-selected={value === priority}
              >
                {priority}
              </li>
            ))}

          </ul>
        </div>
      )}
    </div>
  );
};

export const TaskForm = ({ isOpen, onClose, onAddTask, onEditTask, task }) => {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Todo',
    createdAt: ''
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [titleError, setTitleError] = useState('');
  const isEditMode = Boolean(task?.id);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (isOpen && event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // Reset form or load task data when modal opens
  useEffect(() => {
    // Only run when modal opens
    if (isOpen) {
      if (task) {
        // Edit mode - load task data
        setFormData({
          id: task.id,
          title: task.title,
          description: task.description || '',
          priority: task.priority || 'Medium',
          status: task.status || 'Todo',
          createdAt: task.createdAt
        });
      } else {
        // Add mode - reset form
        resetForm();
      }
      setTitleError('');
    }
  }, [isOpen, task]);

  // Helper function to reset the form
  const resetForm = () => {
    setFormData({
      id: '',
      title: '',
      description: '',
      priority: 'Medium',
      status: 'Todo',
      createdAt: ''
    });
  };

  // Stop rendering if the modal is closed
  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'title' && titleError) {
      setTitleError('');
    }
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      setTitleError('Title is required');
      return;
    }

    if (isEditMode) {
      // Edit existing task - make sure to preserve the original ID and status
      onEditTask({
        ...formData,
        id: task.id // Ensure we're using the original task ID
      });
    } else {
      // Create new task
      const newTask = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toLocaleDateString(),
        status: 'Todo', // Explicitly set status for new tasks
      };
      onAddTask(newTask);
    }

    // Make sure to reset the form after saving
    resetForm();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-charcoal/50 flex items-center justify-center drop-shadow-2xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-zinc-800 p-6 rounded-xl flex flex-col gap-4 w-96 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="form-title" className="text-xl font-semibold text-white">
          {isEditMode ? 'Edit Task' : 'Add Task'}
        </h2>
        
        <div>
          <input
            placeholder="Task title"
            className={`p-2.5 border-1 rounded-xl bg-charcoal border-steel w-full transition-colors focus:outline-none focus:ring-2 focus:ring-steel-blue ${
              titleError ? 'border-red-500 ring-1 ring-red-500' : ''
            }`}
            onChange={(e) => handleChange('title', e.target.value)}
            value={formData.title}
            aria-label="Task title"
            aria-required="true"
            aria-invalid={Boolean(titleError)}
          />
          {titleError && (
            <p className="text-red-500 text-sm mt-1">{titleError}</p>
          )}
        </div>
        
        <textarea
          placeholder="Task description"
          className="p-2.5 border-1 rounded-xl bg-charcoal border-steel min-h-[100px] transition-colors focus:outline-none focus:ring-2 focus:ring-steel-blue"
          onChange={(e) => handleChange('description', e.target.value)}
          value={formData.description}
          aria-label="Task description"
        />
        
        <label className="text-white text-sm">Priority</label>
        <PriorityDropdown 
          value={formData.priority}
          onChange={(value) => handleChange('priority', value)}
          isOpen={isDropdownOpen}
          setIsOpen={setIsDropdownOpen}
        />

        <div className="flex gap-2 mt-2">
          <button
            onClick={onClose}
            className="p-2.5 bg-charcoal border-1 border-steel rounded-xl text-white hover:bg-zinc-700 flex-1 transition-colors"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="p-2.5 bg-steel-blue rounded-xl text-white hover:bg-steel-blue-dark flex-1 transition-colors"
            type="button"
          >
            {isEditMode ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
