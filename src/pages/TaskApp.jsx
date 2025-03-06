import React from 'react';
import { Header, Layout } from '../components/layout';
import { TaskSection } from '../components/ui';
export default function TaskApp() {
  return (
    <Layout>
      <Header />
      <div className=" flex flex-row p-2.5 items-start gap-3">
        <TaskSection title="Todo"></TaskSection>
        <TaskSection title="In Progress"></TaskSection>
        <TaskSection title="Done"></TaskSection>
      </div>
    </Layout>
  );
}
