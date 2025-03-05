import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import TaskApp from './pages/TaskApp';
import '../src/styles/index.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="p-4 bg-blue-600 text-white">
        <ul className="flex gap-6 justify-center">
          <li>
            <Link to="/" className="hover:underline">Home</Link>
          </li>
          <li>
            <Link to="/tasks" className="hover:underline">Task Manager</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<TaskApp />} />
      </Routes>
    </div>
  );
}

export default App;
