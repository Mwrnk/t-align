/**
 * Utility functions for exporting tasks in different formats
 */

/**
 * Export tasks as CSV
 * @param {Array} tasks - Array of task objects
 * @returns {string} CSV formatted string
 */
export const exportAsCSV = (tasks) => {
  // Define CSV headers
  const headers = ["ID", "Title", "Description", "Status", "Priority", "Due Date", "Created At"];
  
  // Create rows with task data
  const rows = tasks.map(task => [
    task.id,
    // Escape quotes in strings to prevent CSV format issues
    task.title ? `"${task.title.replace(/"/g, '""')}"` : "",
    task.description ? `"${task.description.replace(/"/g, '""')}"` : "",
    task.status || "",
    task.priority || "",
    task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "",
    task.createdAt ? new Date(task.createdAt).toLocaleDateString() : ""
  ]);
  
  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");
  
  return csvContent;
};

/**
 * Export tasks as JSON
 * @param {Array} tasks - Array of task objects
 * @param {boolean} pretty - Whether to format the JSON with indentation
 * @returns {string} JSON string
 */
export const exportAsJSON = (tasks, pretty = true) => {
  return pretty ? JSON.stringify(tasks, null, 2) : JSON.stringify(tasks);
};

/**
 * Export tasks as plain text
 * @param {Array} tasks - Array of task objects
 * @returns {string} Plain text formatted string
 */
export const exportAsText = (tasks) => {
  let textContent = "TASK LIST\n\n";
  
  // Group tasks by status
  const tasksByStatus = tasks.reduce((acc, task) => {
    const status = task.status || "Uncategorized";
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(task);
    return acc;
  }, {});
  
  // Format each group
  Object.entries(tasksByStatus).forEach(([status, statusTasks]) => {
    textContent += `== ${status.toUpperCase()} ==\n\n`;
    
    statusTasks.forEach(task => {
      textContent += `- ${task.title}\n`;
      if (task.description) {
        textContent += `  ${task.description}\n`;
      }
      if (task.priority) {
        textContent += `  Priority: ${task.priority}\n`;
      }
      if (task.dueDate) {
        textContent += `  Due: ${new Date(task.dueDate).toLocaleDateString()}\n`;
      }
      textContent += `  Created: ${task.createdAt || "Unknown"}\n\n`;
    });
  });
  
  return textContent;
};

/**
 * Create and download a file
 * @param {string} content - File content
 * @param {string} fileName - Name for the downloaded file
 * @param {string} mimeType - MIME type of the file
 */
export const downloadFile = (content, fileName, mimeType) => {
  // Create a blob with the content
  const blob = new Blob([content], { type: mimeType });
  
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Create a link element
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  
  // Append to the document, click to download, then remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Release the blob URL
  URL.revokeObjectURL(url);
};

/**
 * Get the appropriate MIME type for a given format
 * @param {string} format - Export format (csv, json, text)
 * @returns {string} MIME type
 */
export const getMimeType = (format) => {
  switch (format.toLowerCase()) {
    case 'csv':
      return 'text/csv';
    case 'json':
      return 'application/json';
    case 'text':
    case 'txt':
      return 'text/plain';
    default:
      return 'text/plain';
  }
};

/**
 * Get the file extension for a given format
 * @param {string} format - Export format (csv, json, text)
 * @returns {string} File extension
 */
export const getFileExtension = (format) => {
  switch (format.toLowerCase()) {
    case 'csv':
      return 'csv';
    case 'json':
      return 'json';
    case 'text':
    case 'txt':
      return 'txt';
    default:
      return 'txt';
  }
}; 