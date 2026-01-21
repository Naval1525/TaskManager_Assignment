# Task Manager - Frontend Application

A complete frontend-only Task Manager application built with Next.js, TypeScript, and Zustand. Features role-based access control with Admin, Manager, and Developer roles.

## Features

- **Role-Based Access Control**: Three user roles (Admin, Manager, Developer) with different permissions
- **Project Management**: Create and manage projects
- **Task Management**: Create, assign, and track tasks with status transitions
- **LocalStorage Persistence**: All data is persisted in browser localStorage
- **Modern UI**: Clean and responsive design with TailwindCSS

## Role Permissions

### Admin
- ✅ Can create Projects
- ❌ Cannot create tasks / assign tasks / change task status

### Manager
- ✅ Can create tasks inside projects
- ✅ Can assign tasks to developers
- ✅ Can review tasks
- ✅ Can change status to NOT_COMPLETED
- ❌ Cannot mark tasks as COMPLETED

### Developer
- ✅ Can start tasks (TODO → IN_PROGRESS)
- ✅ Can end tasks (IN_PROGRESS → REVIEW)
- ✅ Can complete tasks (REVIEW → COMPLETED)

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation Steps

1. **Navigate to the project directory:**
   ```bash
   cd task-manager
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
task-manager/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Login page
│   │   ├── layout.tsx          # Root layout
│   │   └── dashboard/          # Dashboard routes
│   │       ├── layout.tsx      # Dashboard layout with sidebar
│   │       ├── page.tsx        # Dashboard redirect
│   │       ├── projects/       # Projects pages
│   │       └── users/          # Users page
│   ├── components/             # React components
│   │   ├── layout/             # Layout components
│   │   ├── projects/           # Project-related components
│   │   ├── tasks/              # Task-related components
│   │   └── ui/                 # Reusable UI components
│   ├── lib/                    # Utility libraries
│   │   ├── storage.ts          # localStorage helpers
│   │   ├── permissions.ts      # Permission checks
│   │   └── utils.ts            # General utilities
│   ├── store/                  # State management
│   │   └── useAppStore.ts      # Zustand store
│   └── types/                  # TypeScript types
│       └── index.ts            # Type definitions
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Usage

1. **Login**: Select a user role (Admin, Manager, or Developer) on the login page
2. **View Projects**: Navigate to the Projects page to see all projects
3. **Create Projects**: Admins can create new projects
4. **Manage Tasks**: 
   - Managers can create tasks and assign them to developers
   - Developers can start, end, and complete assigned tasks
5. **View Users**: See all users and their roles on the Users page

## Data Persistence

All data is stored in browser localStorage with the following keys:
- `tm_users`: User data
- `tm_projects`: Project and task data
- `tm_current_user`: Currently logged-in user

On first load, the app seeds initial data with:
- 3 users (Admin, Manager, Developer)
- 1 sample project with 2 tasks

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Zustand**: Lightweight state management
- **TailwindCSS**: Utility-first CSS framework
- **localStorage**: Client-side data persistence

## Development

The project follows clean code principles:
- Atomic permission functions
- Reusable components
- Type-safe operations
- Proper error handling
- Route protection

## License

This project is created for educational purposes.
