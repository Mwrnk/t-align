import React, { useEffect, useRef } from 'react';
import { Header, Layout } from '../components/layout';
import { TaskSection, TaskForm } from '../components/ui';
import * as Swapy from 'swapy';

export default function TaskApp() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [tasks, setTasks] = React.useState(() => {
    // Load tasks from localStorage on component mount
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [editingTask, setEditingTask] = React.useState(null);
  const containerRef = useRef(null);
  const swapyRef = useRef(null);
  
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    console.log('Tasks updated and saved to localStorage:', tasks);
    
    // Update Swapy instance when tasks change
    if (swapyRef.current) {
      // Give React time to update the DOM before updating Swapy
      setTimeout(() => {
        try {
          swapyRef.current.update();
          console.log('Swapy instance updated');
        } catch (e) {
          console.error("Error updating Swapy:", e);
          
          // If update fails, recreate the Swapy instance
          initializeSwapy();
        }
      }, 50);
    }
  }, [tasks]);
  
  // Initialize or reinitialize Swapy
  const initializeSwapy = () => {
    // Only initialize if container exists
    if (!containerRef.current) return;
    
    // Clean up previous instance
    if (swapyRef.current) {
      try {
        swapyRef.current.destroy();
      } catch (e) {
        console.error("Error destroying Swapy:", e);
      }
      swapyRef.current = null;
    }
    
    try {
      // Create Swapy instance
      swapyRef.current = Swapy.createSwapy(containerRef.current, {
        animation: 'spring',
        enabled: true,
        swapMode: 'drop',
        dragAxis: 'both',
        autoScrollOnDrag: true
      });
      
      // Listen for swap events
      swapyRef.current.onSwapEnd((event) => {
        if (event.hasChanged) {
          console.log('Swap happened:', event);
          
          // Update task status based on the swap
          const { slotItemMap } = event;
          slotItemMap.asArray.forEach(({ slot, item }) => {
            // Skip empty slots
            if (!item || item.startsWith('empty-')) return;
            
            // Extract the base status from slots (strip out any index)
            const statusMatch = slot.match(/^(Todo|In Progress|Done)(?:-\d+)?$/);
            if (statusMatch) {
              const newStatus = statusMatch[1]; // First capturing group is the status
              
              setTasks(prevTasks => 
                prevTasks.map(task => 
                  task.id === item ? { ...task, status: newStatus } : task
                )
              );
            }
          });
        }
      });
      
      console.log('Swapy instance created successfully');
    } catch (error) {
      console.error("Failed to initialize Swapy:", error);
    }
  };
  
  // Initialize Swapy when the component mounts 
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initializeSwapy();
    }, 100);
    
    return () => {
      clearTimeout(timer);
      if (swapyRef.current) {
        try {
          swapyRef.current.destroy();
        } catch (e) {
          console.error("Error cleaning up Swapy:", e);
        }
        swapyRef.current = null;
      }
    };
  }, []); // Only run on mount
  
  // Reinitialize Swapy when task count changes (tasks added or removed)
  useEffect(() => {
    if (tasks.length > 0) {
      // Short delay to allow React to update the DOM
      const timer = setTimeout(() => {
        initializeSwapy();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [tasks.length]);
  
  const openModal = (task = null) => {
    console.log("Opening modal with task:", task);
    setEditingTask(task);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };
  
  const addTask = (task) => {
    console.log('Adding task:', task);
    setTasks([...tasks, task]);
  };
  
  const updateTask = (updatedTask) => {
    console.log('Updating task:', updatedTask);
    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };
  
  const deleteTask = (id) => {
    console.log('Deleting task:', id);
    setTasks(tasks.filter((task) => task.id !== id));
  };
  
  // Filter tasks by status
  const todoTasks = tasks.filter((task) => task.status === 'Todo');
  const inProgressTasks = tasks.filter((task) => task.status === 'In Progress');
  const doneTasks = tasks.filter((task) => task.status === 'Done');
  
  return (
    <Layout>
      <Header handleButton={() => openModal(null)} />
      <div className="flex flex-row p-2.5 items-start gap-3" ref={containerRef}>
        <TaskForm
          isOpen={isModalOpen}
          onClose={closeModal}
          onAddTask={addTask}
          onEditTask={updateTask}
          task={editingTask}
        />
        <TaskSection
          status="Todo"
          title="Todo"
          tasks={todoTasks}
          onEdit={openModal}
          onDelete={deleteTask}
        />
        <TaskSection
          status="In Progress"
          title="In Progress"
          tasks={inProgressTasks}
          onEdit={openModal}
          onDelete={deleteTask}
        />
        <TaskSection
          status="Done"
          title="Done"
          tasks={doneTasks}
          onEdit={openModal}
          onDelete={deleteTask}
        />
      </div>
    </Layout>
  );
}
