import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import TaskCard from './taskCard';

function TaskSection({ id, title, tasks = [], onEdit, onDelete, onStatusChange }) {
  // Setup droppable area
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div 
      ref={setNodeRef}
      className={`flex-1 shrink-0 basis-0 min-h-full p-2.5 flex flex-col justify-start 
        items-center gap-3 self-stretch rounded-xl bg-charcoal 
        ${isOver ? 'ring-2 ring-blue-500 opacity-90' : ''}
        transition-all duration-200`}
    >
      <div className="font-title text-center w-full">
        <h1>{title}</h1>
        <span className="text-sm text-gray-400">{tasks.length} tasks</span>
      </div>
      <div className="w-full">
        <SortableContext 
          items={tasks.map(task => task.id)} 
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              task={task}
              onEdit={() => onEdit(task)}
              onDelete={() => onDelete(task.id)}
              onStatusChange={onStatusChange}
            />
          ))}
        </SortableContext>
        
        {/* Empty state placeholder when no tasks are present */}
        {tasks.length === 0 && (
          <div className="p-4 text-center text-gray-500 italic">
            No tasks here. Drag a task or add a new one.
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskSection;
