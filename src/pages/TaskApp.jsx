import React, { useEffect } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  TouchSensor,
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Header, Layout } from '../components/layout';
import { TaskSection, TaskForm, TaskCard } from '../components/ui';

// Local storage key for tasks
const TASKS_STORAGE_KEY = 'taskmanager_tasks';

export default function TaskApp() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [tasks, setTasks] = React.useState([]);
  const [editingTask, setEditingTask] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedPriority, setSelectedPriority] = React.useState('All');
  const [activeId, setActiveId] = React.useState(null);

  // Setup DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.error('Failed to parse saved tasks:', e);
      }
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const openModal = (task = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const addTask = (task) => {
    setTasks([...tasks, task]);
  };

  const updateTask = (updatedTask) => {
    if (editingTask) {
      setTasks(
        tasks.map((task) => {
          if (task.id === updatedTask.id) {
            return updatedTask;
          }
          return task;
        })
      );
    } else {
      addTask(updatedTask);
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const updateTaskStatus = (id, newStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  // Filter tasks based on search query and priority
  const filterTasks = (taskList) => {
    return taskList.filter(task => {
      const matchesSearch = searchQuery.trim() === '' ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPriority = selectedPriority === 'All' || 
        task.priority === selectedPriority;

      return matchesSearch && matchesPriority;
    });
  };

  // Filter tasks by status and then apply search/priority filters
  const todoTasks = filterTasks(tasks.filter((task) => task.status === 'Todo'));
  const inProgressTasks = filterTasks(tasks.filter((task) => task.status === 'In Progress'));
  const doneTasks = filterTasks(tasks.filter((task) => task.status === 'Done'));

  // Find the active task for drag overlay
  const activeTask = tasks.find(task => task.id === activeId);

  // Handle start of drag operation
  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
  };

  // Handle drag over event - determines drop target
  const handleDragOver = (event) => {
    const { active, over } = event;
    
    if (!over) return;
    
    // If dragging over a container rather than another task
    if (over.id === 'Todo' || over.id === 'In Progress' || over.id === 'Done') {
      const activeTask = tasks.find(task => task.id === active.id);
      
      // Only update if status would change
      if (activeTask.status !== over.id) {
        setTasks(tasks.map(task => 
          task.id === active.id 
            ? { ...task, status: over.id } 
            : task
        ));
      }
      return;
    }
    
    // Get task data
    const activeTask = tasks.find(task => task.id === active.id);
    const overTask = tasks.find(task => task.id === over.id);
    
    // If tasks are in different containers, move the task to the new container
    if (activeTask.status !== overTask.status) {
      setTasks(tasks.map(task => 
        task.id === active.id 
          ? { ...task, status: overTask.status } 
          : task
      ));
    }
  };

  // Handle end of drag operation
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    setActiveId(null);
    
    // If no valid drop target, do nothing
    if (!over) return;

    // If dragging to a container
    if (over.id === 'Todo' || over.id === 'In Progress' || over.id === 'Done') {
      setTasks(tasks.map(task => 
        task.id === active.id 
          ? { ...task, status: over.id } 
          : task
      ));
      return;
    }
    
    // Get references to the tasks
    const activeTaskIndex = tasks.findIndex(task => task.id === active.id);
    const overTaskIndex = tasks.findIndex(task => task.id === over.id);
    
    // If over self, do nothing
    if (activeTaskIndex === overTaskIndex) return;
    
    // Reorder the tasks
    setTasks(arrayMove(tasks, activeTaskIndex, overTaskIndex));
  };

  return (
    <Layout>
      <Header 
        handleButton={openModal}
        onSearch={setSearchQuery}
        onPriorityFilter={setSelectedPriority}
        selectedPriority={selectedPriority}
      />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col md:flex-row p-2.5 items-start gap-3">
          <TaskForm
            isOpen={isModalOpen}
            onClose={closeModal}
            onAddTask={addTask}
            onEditTask={updateTask}
            task={editingTask}
          />
          <TaskSection
            id="Todo"
            title="Todo"
            tasks={todoTasks}
            onEdit={openModal}
            onDelete={deleteTask}
            onStatusChange={updateTaskStatus}
          />
          <TaskSection
            id="In Progress"
            title="In Progress"
            tasks={inProgressTasks}
            onEdit={openModal}
            onDelete={deleteTask}
            onStatusChange={updateTaskStatus}
          />
          <TaskSection
            id="Done"
            title="Done"
            tasks={doneTasks}
            onEdit={openModal}
            onDelete={deleteTask}
            onStatusChange={updateTaskStatus}
          />
          
          {/* Drag Overlay for visual feedback during drag */}
          <DragOverlay adjustScale={true} dropAnimation={{ duration: 300, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' }}>
            {activeId && activeTask ? (
              <TaskCard
                task={activeTask}
                onEdit={() => {}}
                onDelete={() => {}}
                onStatusChange={() => {}}
                isDragging={true}
              />
            ) : null}
          </DragOverlay>
        </div>
      </DndContext>
    </Layout>
  );
}
