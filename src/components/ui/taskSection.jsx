import React from 'react';
import { TaskCard } from '.';

function TaskSection({ status, title, tasks = [], onEdit, onDelete }) {
  return (
    <div className="flex-1 shrink-0 basis-0 min-h-[400px] p-2.5 flex flex-col justify-start items-center gap-3 self-stretch rounded-xl bg-charcoal">
      <div className="font-title text-center w-full">
        <h1>{title}</h1>
      </div>
      <div className="w-full flex-1 task-container">
        {/* Main slot for the column (accepts first task or empty placeholder) */}
        <div 
          data-swapy-slot={status} 
          className="swapy-slot mb-3"
        >
          {tasks.length > 0 ? (
            <div 
              data-swapy-item={tasks[0].id} 
              className="swapy-item w-full"
            >
              <TaskCard
                task={tasks[0]}
                onEdit={() => onEdit(tasks[0])}
                onDelete={() => onDelete(tasks[0].id)}
              />
            </div>
          ) : (
            <div 
              data-swapy-item={`empty-${status}`}
              className="p-4 text-center text-gray-500 h-24 border border-dashed border-gray-700 rounded-xl my-2 flex items-center justify-center"
            >
              Drop tasks here
            </div>
          )}
        </div>
        
        {/* Additional tasks beyond the first one */}
        {tasks.slice(1).map((task, index) => (
          <div 
            key={task.id} 
            data-swapy-slot={`${status}-${index + 1}`} 
            className="swapy-slot mb-3"
          >
            <div 
              data-swapy-item={task.id} 
              className="swapy-item w-full"
            >
              <TaskCard
                task={task}
                onEdit={() => onEdit(task)}
                onDelete={() => onDelete(task.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskSection;
