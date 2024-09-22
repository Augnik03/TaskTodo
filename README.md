# Task Management App - README

## Overview

This is a React-based task management application that allows users to create, filter, search, and manage tasks. The app supports adding new tasks with attributes like title, description, due date, priority, and status. It also provides features to edit, delete, filter, and search tasks using an intuitive interface with support for both list and grid views.

### Features:
- Add, edit, and delete tasks
- Search tasks by title or description
- Filter tasks by priority and status
- List and grid view options
- Tasks are saved to `localStorage` for persistence
- Responsive and user-friendly interface

## Prerequisites

Before running this app, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 14 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) (for managing dependencies)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Augnik03/TaskTodo.git
   cd TaskTodo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the application:**
   ```bash
   npm start
   ```

   The application will start and be available at `http://localhost:3000/`.


## Components

- **App.tsx:** The main component that handles task creation, search, filters, and views.
- **TaskItem.tsx:** Displays individual tasks with options to edit or delete.
- **TaskCard.tsx:** Displays tasks in a card format for grid view.
- **Popover.tsx:** A popover component used for showing filters.
- **Checkbox.tsx:** A reusable checkbox component for filter options.
- **Card, Input, Button, etc.:** Custom UI components for consistent styling.

## Usage

1. **Creating Tasks:**
   - Enter a title, due date, description, select priority, and status, and then click the "Add Task" button.
   - The task will be added to the task list and displayed in either list or grid view, depending on the selected mode.

2. **Editing Tasks:**
   - Click the edit icon on a task to modify its details.
   - After making changes, save the task by clicking the "Save" button.

3. **Deleting Tasks:**
   - Click the delete icon on any task to remove it from the list.

4. **Searching Tasks:**
   - Use the search bar at the top to filter tasks by title or description.

5. **Filtering Tasks:**
   - Click the "Filters" button to filter tasks by priority and status.

6. **View Modes:**
   - Toggle between list and grid views using the options above the task list.

## Styling

- **TailwindCSS:** The app uses TailwindCSS for responsive design and utility classes.
- **Lucide Icons:** Icons for actions like search, filter, calendar, etc., are provided by Lucide-React.

## Data Persistence

The app uses `localStorage` to persist tasks. This means tasks will remain available even after refreshing or closing the browser. When a task is added, edited, or deleted, the changes are automatically saved to `localStorage`.

## Customization

You can extend or modify the task structure by updating the `Task` interface in `App.tsx`. Add more fields like "Tags," "Assignees," or other properties depending on your project requirements.

## Contributions

Feel free to fork the repository and submit pull requests. Any contributions to improve the app are welcome!



---

Enjoy managing your tasks efficiently with **Tasky**!