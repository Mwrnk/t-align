import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, X, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { taskSchema } from '@/lib/schemas';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-charcoal px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export const TaskForm = ({ isOpen, onClose, onAddTask, onEditTask, task }) => {
  const isEditMode = Boolean(task?.id);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // Form configuration with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'Medium',
      status: 'Todo',
      dueDate: null
    },
  });

  // Update form when editing task
  useEffect(() => {
    if (isOpen && task) {
      // When editing, populate the form with task data
      form.reset({
        title: task.title,
        description: task.description || '',
        priority: task.priority || 'Medium',
        status: task.status || 'Todo',
        dueDate: task.dueDate ? new Date(task.dueDate) : null
      });
    } else if (isOpen) {
      // When adding new, reset to defaults
      form.reset({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'Todo',
        dueDate: null
      });
    }
  }, [isOpen, task, form]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Format the date for storage
      const formattedData = {
        ...data,
        dueDate: data.dueDate ? data.dueDate.toISOString().split('T')[0] : null
      };
      
      if (isEditMode) {
        // Edit existing task
        await onEditTask({
          ...formattedData,
          id: task.id,
          createdAt: task.createdAt
        });
        toast.success('Task updated successfully!');
      } else {
        // Create new task
        await onAddTask({
          ...formattedData,
          id: Date.now().toString(),
          createdAt: new Date().toLocaleDateString()
        });
        toast.success('Task added successfully!');
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error(isEditMode ? 'Failed to update task' : 'Failed to add task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-zinc-800 border-steel">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Task' : 'Add Task'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Task Title <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter task title"
                      className="bg-charcoal border-steel"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter task description"
                      className="bg-charcoal border-steel min-h-[100px]"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      disabled={isSubmitting}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-charcoal border-steel">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-zinc-800 border-steel">
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Controller
                      control={form.control}
                      name="dueDate"
                      render={({ field }) => (
                        <div className="relative">
                          <DatePicker 
                            date={field.value} 
                            setDate={field.onChange}
                          />
                          {field.value && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
                              onClick={() => field.onChange(null)}
                              disabled={isSubmitting}
                            >
                              <X className="h-3.5 w-3.5" />
                              <span className="sr-only">Clear due date</span>
                            </Button>
                          )}
                        </div>
                      )}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="bg-charcoal border-steel hover:bg-zinc-700"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-steel-blue hover:bg-steel-blue-dark"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? 'Update' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
