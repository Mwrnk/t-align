import React from 'react';
import { Header, Layout } from '../components/layout';
import { TaskSection } from '../components/ui';
export default function TaskApp() {
  return (
    <Layout>
      <Header />
      <div className=" flex flex-row p-2.5 items-start gap-3">
        <TaskSection title="Todo">
          <div>Task 1</div>
          <div>Task 2</div>
          <div>Task 3</div>
        </TaskSection>
        <TaskSection title="In Progress">
          <div>Task 4</div>
          <div>Task 5</div>
          <div>Task 6</div>
        </TaskSection>
        <TaskSection title="Done">
          <div>Task 7</div>
          <div>Task 8</div>
          <div>Task 9</div>
        </TaskSection>
      </div>
    </Layout>
  );
}
