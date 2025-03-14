import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
import { toast } from 'sonner';
import { Header, Layout } from '../components/layout';
import { TaskSection, TaskForm, TaskCard } from '../components/ui';
import ExportTasksDialog from '../components/ui/ExportTasksDialog';
import { getAllTasks, saveTasks, addTask as addTaskService, updateTask as updateTaskService, deleteTask as deleteTaskService, sortTasks } from '../lib/taskService';
import { cn } from '../lib/utils';

// Configuração do viewport para melhor responsividade
const configureViewport = () => {
  if (!document.querySelector('meta[name="viewport"]')) {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0';
    document.head.appendChild(meta);
  }
  
  // Prevenir overflow horizontal
  document.body.classList.add('overflow-x-hidden');
  return () => document.body.classList.remove('overflow-x-hidden');
};

export default function TaskApp() {
  // Estado principal da aplicação
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [activeId, setActiveId] = useState(null);
  // Estado para visualização com um valor chave para forçar recarregamento
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('viewMode') || 'board');
  const [renderKey, setRenderKey] = useState(Date.now()); // Key para forçar re-renderização
  const [sortingMethod, setSortingMethod] = useState(() => localStorage.getItem('sortingMethod') || 'date');

  // Definir os sensores para arrastar e soltar fora do useMemo para evitar problemas de hooks
  const pointerSensor = useSensor(PointerSensor, { 
    activationConstraint: { distance: 8 } 
  });
  
  const touchSensor = useSensor(TouchSensor, { 
    activationConstraint: { delay: 200, tolerance: 8 } 
  });
  
  const keyboardSensor = useSensor(KeyboardSensor, { 
    coordinateGetter: sortableKeyboardCoordinates 
  });
  
  const sensors = useSensors(pointerSensor, touchSensor, keyboardSensor);

  // Carregamento inicial das tarefas
  useEffect(() => {
    const savedTasks = getAllTasks();
    setTasks(savedTasks);
  }, []);

  // Detectar mudanças no método de ordenação
  useEffect(() => {
    const handleStorageChange = () => {
      const newSortingMethod = localStorage.getItem('sortingMethod') || 'date';
      if (newSortingMethod !== sortingMethod) {
        setSortingMethod(newSortingMethod);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [sortingMethod]);

  // Aplicar ordenação quando necessário
  useEffect(() => {
    if (tasks.length) {
      setTasks(prev => sortTasks([...prev], sortingMethod));
    }
  }, [sortingMethod]);

  // Verificar tarefas com prazos próximos
  useEffect(() => {
    const checkUpcomingTasks = () => {
      const taskRemindersEnabled = localStorage.getItem('taskReminders') === 'true';
      if (!taskRemindersEnabled || !tasks.length) return;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Filtrar tarefas próximas
      const upcomingTasks = tasks.filter(task => {
        if (!task.dueDate || task.status === 'Done') return false;
        
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        
        return (
          dueDate.getTime() === today.getTime() || 
          dueDate.getTime() === tomorrow.getTime()
        );
      });
      
      // Mostrar notificações
      upcomingTasks.forEach(task => {
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        
        const isDueToday = dueDate.getTime() === today.getTime();
        
        if (isDueToday) {
          toast.warning(`Due today: ${task.title}`, {
            description: `This task is due today: ${task.priority} priority`,
            duration: 5000,
          });
        } else {
          toast.info(`Due tomorrow: ${task.title}`, {
            description: `This task is due tomorrow: ${task.priority} priority`,
            duration: 5000,
          });
        }
      });
    };
    
    // Verificar ao carregar e a cada hora
    checkUpcomingTasks();
    const interval = setInterval(checkUpcomingTasks, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [tasks]);

  // Configurar viewport e configurações da aplicação
  useEffect(() => configureViewport(), []);

  // Alternar entre modos de visualização
  const handleViewModeChange = useCallback((newViewMode) => {
    if (newViewMode !== viewMode) {
      setViewMode(newViewMode);
      localStorage.setItem('viewMode', newViewMode);
      // Forçar re-renderização para garantir atualização imediata da interface
      setRenderKey(Date.now());
    }
  }, [viewMode]);

  // Abrir modal para edição ou criação de tarefas
  const openModal = useCallback((task = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  }, []);

  // Fechar modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingTask(null);
  }, []);

  // Adicionar nova tarefa
  const addTask = useCallback((task) => {
    const newTask = addTaskService(task);
    setTasks(prev => sortTasks([...prev, newTask], sortingMethod));
    toast.success('Task added successfully!');
  }, [sortingMethod]);

  // Atualizar tarefa existente
  const updateTask = useCallback((updatedTask) => {
    if (editingTask) {
      const result = updateTaskService(updatedTask);
      if (result) {
        setTasks(prev => sortTasks(
          prev.map(task => task.id === updatedTask.id ? updatedTask : task),
          sortingMethod
        ));
        toast.success('Task updated successfully!');
      } else {
        toast.error('Error updating task');
      }
    } else {
      addTask(updatedTask);
    }
  }, [editingTask, addTask, sortingMethod]);

  // Excluir tarefa
  const deleteTask = useCallback((id) => {
    const success = deleteTaskService(id);
    if (success) {
      setTasks(prev => prev.filter(task => task.id !== id));
      toast.success('Task deleted successfully!');
    } else {
      toast.error('Error deleting task');
    }
  }, []);

  // Alterar status da tarefa
  const updateTaskStatus = useCallback((id, newStatus) => {
    setTasks(prev => {
      const updatedTasks = prev.map(task => 
        task.id === id ? { ...task, status: newStatus } : task
      );
      saveTasks(updatedTasks);
      return updatedTasks;
    });
    
    // Feedback visual para o usuário
    if (newStatus === 'Done') {
      toast.success('Task completed!');
    } else if (newStatus === 'Todo') {
      toast.info('Task marked as todo');
    } else if (newStatus === 'In Progress') {
      toast.info('Task in progress');
    }
  }, []);

  // Filtrar tarefas com base na pesquisa e prioridade
  const filterTasks = useCallback((taskList) => {
    return taskList.filter(task => {
      const matchesSearch = searchQuery.trim() === '' ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesPriority = selectedPriority === 'All' || 
        task.priority === selectedPriority;

      return matchesSearch && matchesPriority;
    });
  }, [searchQuery, selectedPriority]);

  // Listas filtradas de tarefas - memoized para evitar recálculos
  const todoTasks = useMemo(() => 
    filterTasks(tasks.filter(task => task.status === 'Todo')),
    [tasks, filterTasks]
  );
  
  const inProgressTasks = useMemo(() => 
    filterTasks(tasks.filter(task => task.status === 'In Progress')),
    [tasks, filterTasks]
  );
  
  const doneTasks = useMemo(() => 
    filterTasks(tasks.filter(task => task.status === 'Done')),
    [tasks, filterTasks]
  );

  // Tarefa ativa durante arrastar e soltar
  const activeTask = useMemo(() => 
    tasks.find(task => task.id === activeId),
    [tasks, activeId]
  );

  // Lidar com início de operação de arrastar
  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id);
  }, []);

  // Lidar com evento durante arrastar
  const handleDragOver = useCallback((event) => {
    const { active, over } = event;
    
    if (!over) return;
    
    // Se arrastar sobre um container
    if (over.id === 'Todo' || over.id === 'In Progress' || over.id === 'Done') {
      const task = tasks.find(t => t.id === active.id);
      
      // Atualizar apenas se o status mudaria
      if (task && task.status !== over.id) {
        setTasks(prev => {
          const updatedTasks = prev.map(t => 
            t.id === active.id ? { ...t, status: over.id } : t
          );
          saveTasks(updatedTasks);
          return updatedTasks;
        });
      }
      return;
    }
    
    // Arrastar sobre outra tarefa
    const activeTask = tasks.find(t => t.id === active.id);
    const overTask = tasks.find(t => t.id === over.id);
    
    // Se tarefas estão em containers diferentes
    if (activeTask && overTask && activeTask.status !== overTask.status) {
      setTasks(prev => {
        const updatedTasks = prev.map(t => 
          t.id === active.id ? { ...t, status: overTask.status } : t
        );
        saveTasks(updatedTasks);
        return updatedTasks;
      });
    }
  }, [tasks]);

  // Lidar com fim de operação de arrastar
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    
    setActiveId(null);
    
    if (!over) return;

    // Se arrastar para um container
    if (over.id === 'Todo' || over.id === 'In Progress' || over.id === 'Done') {
      const task = tasks.find(t => t.id === active.id);
      if (!task) return;
      
      const oldStatus = task.status;
      const newStatus = over.id;
      
      if (oldStatus !== newStatus) {
        setTasks(prev => {
          const updatedTasks = prev.map(t => 
            t.id === active.id ? { ...t, status: newStatus } : t
          );
          saveTasks(updatedTasks);
          return updatedTasks;
        });
        
        toast.info(`Task moved to ${newStatus}`);
      }
      return;
    }
    
    // Reordenar tarefas
    const activeTaskIndex = tasks.findIndex(t => t.id === active.id);
    const overTaskIndex = tasks.findIndex(t => t.id === over.id);
    
    if (activeTaskIndex === overTaskIndex) return;
    
    setTasks(prev => {
      const updatedTasks = arrayMove(prev, activeTaskIndex, overTaskIndex);
      saveTasks(updatedTasks);
      return updatedTasks;
    });
    
    toast.info('Task order updated');
  }, [tasks]);

  return (
    <Layout>
      {/* Header com opções de filtragem e navegação */}
      <div className="bg-background shadow-md z-10 sticky top-0 p-4 flex flex-col md:flex-row justify-between items-center gap-3">
        <Header 
          handleButton={openModal}
          onSearch={setSearchQuery}
          onPriorityFilter={setSelectedPriority}
          selectedPriority={selectedPriority}
          onViewChange={handleViewModeChange}
        />
        <div className="hidden md:flex md:items-center md:mt-0 mt-3">
          <ExportTasksDialog tasks={tasks} />
        </div>
      </div>
      
      {/* Contexto de arrastar e soltar */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* Container principal com layout responsivo */}
        <div 
          key={`container-${renderKey}`}
          className={cn(
            "p-4 mx-auto w-full max-w-screen-2xl",
            viewMode === 'board' 
              ? "grid grid-cols-1 md:grid-cols-3 gap-4" 
              : "flex flex-col gap-2 max-w-4xl mx-auto"
          )}
        >
          {/* Formulário de tarefas */}
          <TaskForm
            isOpen={isModalOpen}
            onClose={closeModal}
            onAddTask={addTask}
            onEditTask={updateTask}
            task={editingTask}
          />
          
          {/* Contador de tarefas no modo lista */}
          {viewMode === 'list' && (
            <div className="flex justify-between items-center p-2 mb-2">
              <span className="text-sm text-muted-foreground">
                {tasks.length} task{tasks.length !== 1 ? 's' : ''} total
              </span>
              <div className="md:hidden">
                <ExportTasksDialog tasks={tasks} />
              </div>
            </div>
          )}
          
          {/* Seções de tarefas */}
          <TaskSection
            key={`todo-${renderKey}`}
            id="Todo"
            title="To-Do"
            tasks={todoTasks}
            onEdit={openModal}
            onDelete={deleteTask}
            onStatusChange={updateTaskStatus}
            viewMode={viewMode}
          />
          <TaskSection
            key={`inprogress-${renderKey}`}
            id="In Progress"
            title="In Progress"
            tasks={inProgressTasks}
            onEdit={openModal}
            onDelete={deleteTask}
            onStatusChange={updateTaskStatus}
            viewMode={viewMode}
          />
          <TaskSection
            key={`done-${renderKey}`}
            id="Done"
            title="Completed"
            tasks={doneTasks}
            onEdit={openModal}
            onDelete={deleteTask}
            onStatusChange={updateTaskStatus}
            viewMode={viewMode}
          />
          
          {/* Overlay para arrastar e soltar */}
          <DragOverlay>
            {activeId && activeTask && (
              <TaskCard
                key={`drag-${activeId}`}
                task={activeTask}
                isDragging={true}
                id={activeId}
                viewMode={viewMode}
              />
            )}
          </DragOverlay>
        </div>
      </DndContext>
    </Layout>
  );
}

