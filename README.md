# T-Align Task Manager

A modern, responsive task management application built with React and Vite that helps you organize and track your tasks efficiently. T-Align features a clean, intuitive user interface with drag-and-drop functionality, multiple view modes, and powerful task organization capabilities.

![T-Align Logo](public/talign.svg)

## Features

- **Intuitive Task Management**: Create, edit, delete, and organize tasks effortlessly
- **Drag-and-Drop Interface**: Easily move tasks between different status columns (Todo, In Progress, Done)
- **Multiple View Modes**: 
  - Board View: Kanban-style columns
  - List View: Compact list format for dense information display
- **Task Organization**:
  - Status tracking (Todo, In Progress, Done)
  - Priority levels (High, Medium, Low)
  - Due dates with visual indicators for overdue tasks
  - Detailed descriptions with expandable sections
- **Rich Filtering and Sorting**:
  - Search by title or description
  - Filter by priority
  - Sort by date, priority, or alphabetically
- **Data Export**: Export your tasks in multiple formats (CSV, JSON, plain text)
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Accessibility Features**: 
  - Keyboard navigation support
  - Reduced motion option
  - Clean, high-contrast UI
- **Persistent Storage**: Tasks are saved in your browser's local storage

## Technologies Used

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **UI Components**: 
  - Shadcn UI
  - Radix UI primitives
- **Styling**: 
  - Tailwind CSS
  - CSS custom properties for theming
- **Form Handling**: 
  - React Hook Form
  - Zod validation
- **Drag and Drop**: 
  - @dnd-kit/core
  - @dnd-kit/sortable
- **Notifications**: Sonner toast notifications
- **Date Handling**: date-fns
- **Routing**: React Router

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/task-manager.git
   cd task-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173/`

## Usage Guide

### Creating a Task

1. Click the "Add Task" button in the header
2. Fill in the task details:
   - Title (required)
   - Description (optional)
   - Priority (High, Medium, Low)
   - Due date (optional)
3. Click "Save" to create the task

### Managing Tasks

- **Change Status**: Drag and drop tasks between columns or use the checkbox to toggle completion
- **Edit**: Click the pencil icon on a task to modify its details
- **Delete**: Click the trash icon and confirm deletion
- **View Details**: Longer descriptions can be expanded with the "Show more" button

### Switching Views

Use the view selector in the header to switch between:
- **Board View**: Kanban-style columns for visual task management
- **List View**: Compact list for efficient space usage

### Filtering and Searching

- Use the search bar to find tasks by title or description
- Filter tasks by priority using the dropdown filter
- Sort tasks using the sorting options in the settings menu

### Exporting Tasks

1. Click the "Export Tasks" button
2. Select your desired format (CSV, JSON, or plain text)
3. Choose which tasks to export (All, Completed, or Pending)
4. Customize the filename if needed
5. Click "Export" to download the file

## Project Structure

```
src/
├── assets/          # Static assets (icons, fonts)
├── components/      # UI components
│   ├── layout/      # Layout components (header, footer)
│   └── ui/          # UI components (buttons, cards, dialogs)
├── context/         # React context providers
├── lib/             # Utility functions and services
│   ├── exportUtils.js       # Task export utilities
│   ├── schemas.js           # Zod validation schemas
│   ├── taskService.js       # Task CRUD operations
│   └── utils.js             # General utility functions
├── pages/           # Main application pages
│   ├── Home.jsx     # Landing page
│   └── TaskApp.jsx  # Main task management page
└── styles/          # Global styles
```

## Customization

### Themes

T-Align supports both light and dark themes. Toggle between them using the theme switch in the footer.

### Preferences

Access additional settings through the settings panel in the footer:
- Toggle reduced motion for animations
- Change the default sorting method
- Set your preferred view mode (board or list)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Shadcn UI](https://ui.shadcn.com/) for the component system
- [Radix UI](https://www.radix-ui.com/) for accessible UI primitives
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [dnd kit](https://dndkit.com/) for drag and drop functionality

---
