import React from 'react';
import { Header, Layout } from '../components/layout';
import { TaskSection, TaskForm } from '../components/ui';

export default function TaskApp() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <Layout>
      <Header handleButton={openModal} />
      <div className="flex flex-row p-2.5 items-start gap-3">
        <TaskForm isOpen={isModalOpen} onClose={closeModal} />
        <TaskSection title="Todo" />
        <TaskSection title="In Progress" />
        <TaskSection title="Done" />
      </div>
    </Layout>
  );
}
