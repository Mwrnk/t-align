// Local storage key for tasks
const TASKS_STORAGE_KEY = 'taskmanager_tasks';

// Maximum localStorage size (in bytes) - approximately 5MB
const MAX_STORAGE_SIZE = 5 * 1024 * 1024;

/**
 * Get all tasks from localStorage
 * @returns {Array} Array of task objects
 */
export const getAllTasks = () => {
  try {
    const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
    if (savedTasks) {
      return JSON.parse(savedTasks);
    }
    return [];
  } catch (error) {
    console.error('Failed to parse saved tasks:', error);
    return [];
  }
};

/**
 * Save all tasks to localStorage
 * @param {Array} tasks - Array of task objects to save
 * @returns {boolean} Success state of the operation
 */
export const saveTasks = (tasks) => {
  try {
    const tasksString = JSON.stringify(tasks);
    
    // Check if we're exceeding localStorage limits
    if (tasksString.length > MAX_STORAGE_SIZE) {
      console.error('Task data exceeds localStorage limits');
      return false;
    }
    
    localStorage.setItem(TASKS_STORAGE_KEY, tasksString);
    return true;
  } catch (error) {
    console.error('Failed to save tasks:', error);
    return false;
  }
};

/**
 * Add a new task
 * @param {Object} task - Task object to add
 * @returns {Object} The added task with ID
 */
export const addTask = (task) => {
  const tasks = getAllTasks();
  const newTask = {
    ...task,
    id: Date.now().toString(),
    createdAt: new Date().toLocaleDateString(),
  };
  
  const updatedTasks = [...tasks, newTask];
  saveTasks(updatedTasks);
  
  return newTask;
};

/**
 * Update an existing task
 * @param {Object} updatedTask - Task object with updates
 * @returns {Object|null} The updated task or null if not found
 */
export const updateTask = (updatedTask) => {
  const tasks = getAllTasks();
  let foundAndUpdated = false;
  
  const updatedTasks = tasks.map((task) => {
    if (task.id === updatedTask.id) {
      foundAndUpdated = true;
      return {
        ...task,
        ...updatedTask,
        updatedAt: new Date().toLocaleDateString(),
      };
    }
    return task;
  });
  
  if (foundAndUpdated) {
    saveTasks(updatedTasks);
    return updatedTask;
  }
  
  return null;
};

/**
 * Delete a task by ID
 * @param {string} id - ID of task to delete
 * @returns {boolean} Whether deletion was successful
 */
export const deleteTask = (id) => {
  const tasks = getAllTasks();
  const initialLength = tasks.length;
  
  const filteredTasks = tasks.filter((task) => task.id !== id);
  
  if (filteredTasks.length < initialLength) {
    saveTasks(filteredTasks);
    return true;
  }
  
  return false;
};

/**
 * Update task status
 * @param {string} id - Task ID
 * @param {string} newStatus - New status for task
 * @returns {Object|null} Updated task or null if not found
 */
export const updateTaskStatus = (id, newStatus) => {
  const tasks = getAllTasks();
  let updatedTask = null;
  
  const updatedTasks = tasks.map((task) => {
    if (task.id === id) {
      updatedTask = {
        ...task,
        status: newStatus,
        updatedAt: new Date().toLocaleDateString(),
      };
      return updatedTask;
    }
    return task;
  });
  
  if (updatedTask) {
    saveTasks(updatedTasks);
    return updatedTask;
  }
  
  return null;
};

/**
 * Sort tasks by specified method
 * @param {Array} tasks - Tasks to sort
 * @param {string} method - Sorting method ('date', 'priority', 'alphabetical')
 * @returns {Array} Sorted tasks
 */
export const sortTasks = (tasks, method = 'date') => {
  const tasksCopy = [...tasks];
  
  switch (method) {
    case 'date':
      // Sort by creation date (newest first)
      return tasksCopy.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
    case 'priority':
      // Sort by priority (high to low)
      const priorityValues = { 'High': 3, 'Medium': 2, 'Low': 1 };
      return tasksCopy.sort((a, b) => {
        return priorityValues[b.priority] - priorityValues[a.priority];
      });
      
    case 'alphabetical':
      // Sort alphabetically by title
      return tasksCopy.sort((a, b) => {
        return a.title.localeCompare(b.title);
      });
      
    default:
      return tasksCopy;
  }
}; 