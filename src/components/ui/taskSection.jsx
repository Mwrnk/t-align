import React from 'react';
import { TaskCard } from '.';

function TaskSection({ title, tasks = [], onEdit, onDelete, onStatusChange }) {
  return (
    <div className="flex-1 shrink-0 basis-0 min-h-full p-2.5 flex flex-col justify-start items-center gap-3 self-stretch rounded-xl bg-charcoal">
      <div className="font-title text-center w-full">
        <h1>{title}</h1>
      </div>
      <div className="w-full">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={() => onEdit(task)}
            onDelete={() => onDelete(task.id)}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </div>
  );
}

export default TaskSection;
