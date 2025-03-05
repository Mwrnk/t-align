import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import TaskApp from './pages/TaskApp';
import '../src/styles/index.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tasks" element={<TaskApp />} />
    </Routes>
  );
}

export default App;
