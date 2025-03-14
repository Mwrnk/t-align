import React, { useEffect, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { cn } from '@/lib/utils';
import TaskCard from './taskCard';

const TaskSection = ({ id, title, tasks, onEdit, onDelete, onStatusChange, viewMode }) => {
  // Setup droppable
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  // Estado local para garantir que o componente reaja imediatamente a mudanças de visualização
  const [currentViewMode, setCurrentViewMode] = useState(viewMode);
  
  // Força a atualização imediata quando o modo de visualização muda
  useEffect(() => {
    setCurrentViewMode(viewMode);
  }, [viewMode]);

  const isListView = currentViewMode === 'list';
  const isBoardView = currentViewMode === 'board';

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col rounded-xl transition-colors transform",
        isBoardView 
          ? "h-full min-h-[50vh] shadow-sm" 
          : "w-full mb-3 overflow-hidden",
        isOver 
          ? "bg-accent/30 ring-2 ring-ring/30" 
          : "bg-card hover:bg-card/90"
      )}
      id={`section-${id}`}
    >
      <div className="flex justify-between items-center py-3 px-4 border-b border-border">
        <h2 className={cn(
          "font-semibold",
          isBoardView ? "text-xl" : "text-lg"
        )}>{title}</h2>
        <div className="bg-primary/20 px-2.5 py-1 rounded-full text-xs font-semibold text-primary">
          {tasks.length}
        </div>
      </div>
      
      <div 
        className={cn(
          "flex-grow overflow-y-auto scrollbar-thin",
          isListView 
            ? "flex flex-col gap-2 p-2" 
            : "grid gap-3 p-3 auto-rows-max content-start",
          // Ajuste de densidade para colunas
          isBoardView && "grid-cols-1"
        )}
        style={{
          maxHeight: isBoardView ? 'calc(100vh - 12rem)' : 'auto',
        }}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              task={task}
              onEdit={() => onEdit(task)}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
              viewMode={currentViewMode}
            />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-24 p-6 my-4 rounded-lg bg-muted/20 border border-border/40">
            <p className="text-center text-muted-foreground">Nenhuma tarefa</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskSection;
