import React from 'react';
import { Header, Layout } from '../components/layout';
import { TaskSection, TaskForm } from '../components/ui';

export default function TaskApp() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [tasks, setTasks] = React.useState([]);
  const [editingTask, setEditingTask] = React.useState(null);

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
        tasks.map((task) => (task.id === editingTask.id ? updatedTask : task))
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

  // Filter tasks by status
  const todoTasks = tasks.filter((task) => task.status === 'Todo');
  const inProgressTasks = tasks.filter((task) => task.status === 'In Progress');
  const doneTasks = tasks.filter((task) => task.status === 'Done');

  return (
    <Layout>
      <Header handleButton={openModal} />
      <div className="flex flex-row p-2.5 items-start gap-3">
        <TaskForm
          isOpen={isModalOpen}
          onClose={closeModal}
          onAddTask={addTask}
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
