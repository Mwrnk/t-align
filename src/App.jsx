import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TaskApp from './pages/TaskApp';
import { ThemeProvider } from './lib/ThemeProvider';
import { Toaster } from './components/ui/sonner';
import '../src/styles/index.css';

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<TaskApp />} />
      </Routes>
      <Toaster richColors />
    </ThemeProvider>
  );
}

export default App;
