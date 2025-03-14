import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import editIcon from '../../assets/icons/PencilSimpleLine.svg';
import removeIcon from '../../assets/icons/Trash.svg';
import dragIcon from '../../assets/icons/DragHandle.svg';
import checkIcon from '../../assets/icons/Check.svg';
import calendarIcon from '../../assets/icons/Calendar.svg';

function TaskCard({ id, task, onEdit, onDelete, onStatusChange, isDragging }) {
  // Setup sortable draggable element
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging
  } = useSortable({ id });

  // Track completion status
  const isCompleted = task.status === 'Done';

  // Check if task is overdue
  const isOverdue = () => {
    if (!task.dueDate || isCompleted) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison
    const dueDate = new Date(task.dueDate);
    return dueDate < today;
  };

  // Format the due date for display
  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    
    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if date is today, tomorrow, or yesterday
    if (dueDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (dueDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else if (dueDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return dueDate.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: dueDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  // Get appropriate priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return { bg: 'bg-red-300', text: 'text-red-700' };
      case 'Medium':
        return { bg: 'bg-yellow-300', text: 'text-yellow-700' };
      case 'Low':
        return { bg: 'bg-green-300', text: 'text-green-700' };
      default:
        return { bg: 'bg-gray-300', text: 'text-gray-700' };
    }
  };

  const priorityColors = getPriorityColor(task.priority);
  
  // Determine if the card is currently being dragged
  const isCurrentlyDragging = isDragging || isSortableDragging;
  const taskIsOverdue = isOverdue();

  // Apply styles from dnd-kit
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isCurrentlyDragging ? 0.6 : 1,
    zIndex: isCurrentlyDragging ? 999 : 1,
  };

  // Handle toggling completion status
  const handleStatusToggle = () => {
    const newStatus = isCompleted ? 'Todo' : 'Done';
    onStatusChange(task.id, newStatus);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex flex-col m-3 p-6 items-start gap-3 rounded-xl shadow-xl 
        ${isCompleted ? 'bg-zinc-800' : 'bg-steel'}
        ${taskIsOverdue ? 'border-l-4 border-red-500' : ''}
        ${isCurrentlyDragging ? 'border-2 border-blue-500 shadow-2xl' : ''}
        transition-all duration-200 touch-manipulation`}
      {...attributes}
    >
      <div className="flex w-full justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <div 
            {...listeners} 
            className="cursor-grab active:cursor-grabbing p-1.5 -ml-1.5 rounded hover:bg-opacity-20 hover:bg-white touch-manipulation"
            aria-label="Drag handle"
          >
            <img src={dragIcon} alt="Drag" className="w-5 h-5" />
          </div>
          <h3 className={`font-semibold ${isCompleted ? 'line-through text-gray-400' : ''}`}>
            {task.title}
          </h3>
        </div>
        <div className="flex gap-2 justify-center items-center">
          <button
            onClick={handleStatusToggle}
            className={`p-1.5 rounded-full w-6 h-6 flex items-center justify-center
              ${isCompleted 
                ? 'bg-green-500 text-white' 
                : 'border-2 border-gray-400 hover:border-white'}`}
            aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
          >
            {isCompleted && <img src={checkIcon} alt="Completed" className="w-4 h-4" />}
          </button>
          <button
            onClick={onEdit}
            className="p-1.5 rounded hover:bg-opacity-20 hover:bg-white focus:outline-none focus:ring-2 focus:ring-steel"
            aria-label="Edit task"
          >
            <img
              src={editIcon}
              className="w-5 h-5"
              alt="Edit"
            />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded hover:bg-opacity-20 hover:bg-white focus:outline-none focus:ring-2 focus:ring-steel"
            aria-label="Delete task"
          >
            <img
              src={removeIcon}
              className="w-5 h-5"
              alt="Delete"
            />
          </button>
        </div>
      </div>
      <div>
        <p className={`font-text ${isCompleted ? 'text-gray-400' : ''}`}>{task.description}</p>
      </div>
      
      <div className="flex flex-wrap gap-2 w-full">
        <div className={`flex gap-2 ${priorityColors.bg} p-2 rounded-xl ${isCompleted ? 'opacity-60' : ''}`}>
          <p className={`font-text ${priorityColors.text} text-sm`}>{task.priority}</p>
        </div>
        
        {task.dueDate && (
          <div className={`flex gap-2 items-center p-2 rounded-xl text-sm
            ${taskIsOverdue && !isCompleted ? 'bg-red-900/30 text-red-200' : 'bg-zinc-700/50 text-gray-300'}
            ${isCompleted ? 'opacity-60' : ''}`}
          >
            <img src={calendarIcon} alt="Due date" className="w-4 h-4" />
            <span>{formatDueDate(task.dueDate)}</span>
          </div>
        )}
      </div>
      
      <p className="font-text text-light-steel text-sm">Created: {task.createdAt}</p>
    </div>
  );
}

export default TaskCard;
