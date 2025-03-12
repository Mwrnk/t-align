import React from 'react';
import { Header, Layout } from '../components/layout';
import { TaskSection, TaskForm } from '../components/ui';

export default function TaskApp() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [tasks, setTasks] = React.useState([]);
  const [editingTask, setEditingTask] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedPriority, setSelectedPriority] = React.useState('All');

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

  return (
    <Layout>
      <Header 
        handleButton={openModal}
        onSearch={setSearchQuery}
        onPriorityFilter={setSelectedPriority}
        selectedPriority={selectedPriority}
      />
      <div className="flex flex-row p-2.5 items-start gap-3">
        <TaskForm
          isOpen={isModalOpen}
          onClose={closeModal}
          onAddTask={addTask}
          onEditTask={updateTask}
          task={editingTask}
        />
        <TaskSection
          title="Todo"
          tasks={todoTasks}
          onEdit={openModal}
          onDelete={deleteTask}
          onStatusChange={updateTaskStatus}
        />
        <TaskSection
          title="In Progress"
          tasks={inProgressTasks}
          onEdit={openModal}
          onDelete={deleteTask}
          onStatusChange={updateTaskStatus}
        />
        <TaskSection
          title="Done"
          tasks={doneTasks}
          onEdit={openModal}
          onDelete={deleteTask}
          onStatusChange={updateTaskStatus}
        />
      </div>
    </Layout>
  );
}
