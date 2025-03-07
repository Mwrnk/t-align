import React from 'react';
import editIcon from '../../assets/icons/PencilSimpleLine.svg';
import removeIcon from '../../assets/icons/Trash.svg';

function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
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

  // Handle drag to change status
  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', task.id);
  };

  return (
    <div
      className="flex flex-col m-3 p-6 items-start gap-3 bg-steel rounded-xl shadow-xl"
      draggable
      onDragStart={handleDragStart}
    >
      <div className="flex w-full justify-between items-center gap-3">
        <h3 className="font-semibold">{task.title}</h3>
        <div className="flex gap-3 justify-center items-center">
          <img
            src={editIcon}
            className="w-6 h-6 cursor-pointer"
            onClick={onEdit}
          />
          <img
            src={removeIcon}
            className="w-6 h-6 cursor-pointer"
            onClick={onDelete}
          />
        </div>
      </div>
      <div>
        <p className="font-text">{task.description}</p>
      </div>
      <div className={`flex gap-3 ${priorityColors.bg} p-2 rounded-xl`}>
        <p className={`font-text ${priorityColors.text}`}>{task.priority}</p>
      </div>
      <p className="font-text text-light-steel">Created: {task.createdAt}</p>
    </div>
  );
}

export default TaskCard;
