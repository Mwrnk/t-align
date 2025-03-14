import React, { useState, memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import editIcon from '../../assets/icons/PencilSimpleLine.svg';
import dragIcon from '../../assets/icons/DragHandle.svg';
import calendarIcon from '../../assets/icons/Calendar.svg';
import { cn } from '@/lib/utils';
import DeleteTaskDialog from './DeleteTaskDialog';

const TaskCard = memo(({ id, task, onEdit, onDelete, onStatusChange, isDragging, viewMode = 'board' }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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
        return { bg: 'bg-destructive/20', text: 'text-destructive' };
      case 'Medium':
        return { bg: 'bg-warning/20', text: 'text-warning' };
      case 'Low':
        return { bg: 'bg-success/20', text: 'text-success' };
      default:
        return { bg: 'bg-muted', text: 'text-muted-foreground' };
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
  const handleStatusToggle = (checked) => {
    const newStatus = checked ? 'Done' : 'Todo';
    onStatusChange(task.id, newStatus);
  };

  // Handle delete button click
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  // Handle confirmation of delete
  const handleConfirmDelete = () => {
    onDelete(task.id);
    setDeleteDialogOpen(false);
  };
  
  // Toggle description expansion
  const toggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  // Determine if we should show the expand button
  const shouldShowExpandButton = task.description && task.description.length > 100;

  // Generate cards based on view mode
  const renderBoardCard = () => (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex flex-col p-4 items-start gap-3 rounded-xl shadow-md transition-all duration-200 touch-manipulation",
        isCompleted ? "bg-muted" : "bg-card",
        taskIsOverdue ? "border-l-4 border-destructive" : "border border-border",
        isCurrentlyDragging ? "shadow-xl ring-2 ring-ring" : "hover:shadow-lg hover:ring-1 hover:ring-ring/50",
        "w-full overflow-hidden"
      )}
      {...attributes}
    >
      <div className="flex w-full justify-between items-center gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div 
            {...listeners} 
            className="cursor-grab active:cursor-grabbing p-1 -ml-1 rounded hover:bg-muted-foreground/10 touch-manipulation"
            aria-label="Drag handle"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-60">
              <path d="M4 4.5C4 5.05228 3.55228 5.5 3 5.5C2.44772 5.5 2 5.05228 2 4.5C2 3.94772 2.44772 3.5 3 3.5C3.55228 3.5 4 3.94772 4 4.5Z" fill="currentColor"/>
              <path d="M4 8C4 8.55228 3.55228 9 3 9C2.44772 9 2 8.55228 2 8C2 7.44772 2.44772 7 3 7C3.55228 7 4 7.44772 4 8Z" fill="currentColor"/>
              <path d="M4 11.5C4 12.0523 3.55228 12.5 3 12.5C2.44772 12.5 2 12.0523 2 11.5C2 10.9477 2.44772 10.5 3 10.5C3.55228 10.5 4 10.9477 4 11.5Z" fill="currentColor"/>
              <path d="M8 4.5C8 5.05228 7.55228 5.5 7 5.5C6.44772 5.5 6 5.05228 6 4.5C6 3.94772 6.44772 3.5 7 3.5C7.55228 3.5 8 3.94772 8 4.5Z" fill="currentColor"/>
              <path d="M8 8C8 8.55228 7.55228 9 7 9C6.44772 9 6 8.55228 6 8C6 7.44772 6.44772 7 7 7C7.55228 7 8 7.44772 8 8Z" fill="currentColor"/>
              <path d="M8 11.5C8 12.0523 7.55228 12.5 7 12.5C6.44772 12.5 6 12.0523 6 11.5C6 10.9477 6.44772 10.5 7 10.5C7.55228 10.5 8 10.9477 8 11.5Z" fill="currentColor"/>
            </svg>
          </div>
          <Checkbox 
            id={`task-${task.id}`}
            checked={isCompleted}
            onCheckedChange={handleStatusToggle}
            className="mr-1 data-[state=checked]:bg-success data-[state=checked]:border-success flex-shrink-0"
          />
          <h3 className={cn(
            "font-medium text-sm truncate",
            isCompleted && "line-through text-muted-foreground"
          )}>
            {task.title}
          </h3>
        </div>
        <div className="flex gap-1 justify-center items-center flex-shrink-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onEdit}
                  className="p-1.5 rounded-md hover:bg-muted focus:outline-none focus:ring-1 focus:ring-ring"
                  aria-label="Edit task"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit task</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleDeleteClick}
                  className="p-1.5 rounded-md hover:bg-muted focus:outline-none focus:ring-1 focus:ring-ring"
                  aria-label="Delete task"
                >
                  <Trash className="w-3.5 h-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete task</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {task.description && (
        <div className="w-full">
          <div className={cn(
            "text-xs text-muted-foreground",
            isCompleted && "text-muted-foreground/60",
            isExpanded ? "line-clamp-none" : "line-clamp-2"
          )}>
            {task.description}
          </div>
          {shouldShowExpandButton && (
            <button 
              onClick={toggleExpand} 
              className="flex items-center text-xs text-primary hover:underline mt-1.5"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Show more
                </>
              )}
            </button>
          )}
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 w-full mt-auto">
        <div className={cn(
          "flex gap-1 p-1.5 rounded-md",
          priorityColors.bg,
          isCompleted && "opacity-60"
        )}>
          <p className={cn(
            "text-xs font-medium",
            priorityColors.text
          )}>
            {task.priority}
          </p>
        </div>
        
        {task.dueDate && (
          <div className={cn(
            "flex gap-1 items-center p-1.5 rounded-md text-xs",
            taskIsOverdue && !isCompleted ? "bg-destructive/20 text-destructive" : "bg-muted text-muted-foreground",
            isCompleted && "opacity-60"
          )}>
            <Calendar className="w-3 h-3" />
            <span>{formatDueDate(task.dueDate)}</span>
          </div>
        )}
      </div>
    </div>
  );
  
  const renderListCard = () => (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex flex-row p-3 items-center gap-3 rounded-lg shadow-sm transition-all duration-200 touch-manipulation",
        isCompleted ? "bg-muted" : "bg-card", 
        taskIsOverdue ? "border-l-4 border-destructive pl-2" : "border border-border",
        isCurrentlyDragging ? "shadow-lg ring-2 ring-ring" : "hover:shadow-md hover:bg-card/95 hover:ring-1 hover:ring-ring/40",
        "w-full"
      )}
      {...attributes}
    >
      <div className="flex items-center gap-3 flex-shrink-0">
        <div 
          {...listeners} 
          className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted-foreground/10 touch-manipulation"
          aria-label="Drag handle"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-60">
            <path d="M4 4.5C4 5.05228 3.55228 5.5 3 5.5C2.44772 5.5 2 5.05228 2 4.5C2 3.94772 2.44772 3.5 3 3.5C3.55228 3.5 4 3.94772 4 4.5Z" fill="currentColor"/>
            <path d="M4 8C4 8.55228 3.55228 9 3 9C2.44772 9 2 8.55228 2 8C2 7.44772 2.44772 7 3 7C3.55228 7 4 7.44772 4 8Z" fill="currentColor"/>
            <path d="M4 11.5C4 12.0523 3.55228 12.5 3 12.5C2.44772 12.5 2 12.0523 2 11.5C2 10.9477 2.44772 10.5 3 10.5C3.55228 10.5 4 10.9477 4 11.5Z" fill="currentColor"/>
            <path d="M8 4.5C8 5.05228 7.55228 5.5 7 5.5C6.44772 5.5 6 5.05228 6 4.5C6 3.94772 6.44772 3.5 7 3.5C7.55228 3.5 8 3.94772 8 4.5Z" fill="currentColor"/>
            <path d="M8 8C8 8.55228 7.55228 9 7 9C6.44772 9 6 8.55228 6 8C6 7.44772 6.44772 7 7 7C7.55228 7 8 7.44772 8 8Z" fill="currentColor"/>
            <path d="M8 11.5C8 12.0523 7.55228 12.5 7 12.5C6.44772 12.5 6 12.0523 6 11.5C6 10.9477 6.44772 10.5 7 10.5C7.55228 10.5 8 10.9477 8 11.5Z" fill="currentColor"/>
          </svg>
        </div>
        
        <Checkbox 
          id={`task-list-${task.id}`}
          checked={isCompleted}
          onCheckedChange={handleStatusToggle}
          className="data-[state=checked]:bg-success data-[state=checked]:border-success"
        />
      </div>
      
      <div className="flex-grow min-w-0 overflow-hidden">
        <h3 className={cn(
          "font-medium text-sm truncate",
          isCompleted && "line-through text-muted-foreground"
        )}>
          {task.title}
        </h3>
        
        {task.description && (
          <p className={cn(
            "text-xs line-clamp-1 mt-0.5 text-muted-foreground",
            isCompleted && "text-muted-foreground/60"
          )}>
            {task.description}
          </p>
        )}
      </div>
      
      <div className="flex gap-2 items-center flex-shrink-0">
        {task.dueDate && (
          <div className={cn(
            "flex gap-1 items-center p-1.5 rounded-md text-xs whitespace-nowrap",
            taskIsOverdue && !isCompleted ? "bg-destructive/20 text-destructive" : "bg-muted text-muted-foreground",
            isCompleted && "opacity-60",
            "hidden sm:flex"
          )}>
            <Calendar className="w-3 h-3" />
            <span>{formatDueDate(task.dueDate)}</span>
          </div>
        )}
        
        <div className={cn(
          "flex gap-1 p-1.5 rounded-md",
          priorityColors.bg,
          isCompleted && "opacity-60"
        )}>
          <p className={cn(
            "text-xs font-medium",
            priorityColors.text
          )}>
            {task.priority}
          </p>
        </div>
        
        <div className="flex gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onEdit}
                  className="p-1.5 rounded-md hover:bg-muted focus:outline-none focus:ring-1 focus:ring-ring"
                  aria-label="Edit task"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit task</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleDeleteClick}
                  className="p-1.5 rounded-md hover:bg-muted focus:outline-none focus:ring-1 focus:ring-ring"
                  aria-label="Delete task"
                >
                  <Trash className="w-3.5 h-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete task</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {viewMode === 'board' ? renderBoardCard() : renderListCard()}
      
      <DeleteTaskDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        taskTitle={task.title}
      />
    </>
  );
});

// Adicionar displayName para melhorar ferramentas de desenvolvimento
TaskCard.displayName = 'TaskCard';

export default TaskCard;
