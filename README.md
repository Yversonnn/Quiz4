https://github.com/KenjiVizcayno28/quiz4-bordon-vizcayno..git



# Project Management Dashboard - API Documentation

## Overview

This is a full-stack project management application with a React frontend and REST API backend. The application allows users to manage projects, tasks, and team members with role-based access control (ADMIN, MANAGER, USER).

---

## API Base URL

```
http://localhost:5000/api/v1
```

---

## Authentication

All API requests (except login) require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_token_here>
```

The token is automatically added to all requests from the React frontend using an interceptor.

---

## API Endpoints

### Projects API

#### 1. Get All Projects
- **Method:** `GET`
- **Endpoint:** `/projects`
- **Description:** Retrieves all projects (Admin sees all, Manager/User sees assigned)
- **Headers:** 
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- **Response (200 OK):**
  ```json
  {
    "data": [
      {
        "id": "1",
        "project_name": "Website Redesign",
        "project_description": "Complete redesign of company website with modern UI/UX",
        "status": "in_progress",
        "hours_consumed": 45,
        "start_date": "2025-01-15",
        "end_date": "2025-06-30",
        "assignedUser": "john-manager",
        "tasks": [...]
      }
    ]
  }
  ```

#### 2. Get Single Project
- **Method:** `GET`
- **Endpoint:** `/projects/{projectId}`
- **Description:** Retrieves details for a specific project
- **Parameters:**
  - `projectId` (path) - The ID of the project
- **Headers:**
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- **Example:** `GET /projects/1`
- **Response (200 OK):**
  ```json
  {
    "data": {
      "id": "1",
      "project_name": "Website Redesign",
      "project_description": "Complete redesign of company website with modern UI/UX",
      "status": "in_progress",
      "hours_consumed": 45,
      "start_date": "2025-01-15",
      "end_date": "2025-06-30",
      "assignedUser": "john-manager",
      "tasks": [
        {
          "id": "t1",
          "task_name": "UI Design",
          "task_description": "Create new UI mockups",
          "status": "completed",
          "hours_consumed": 20,
          "user_assigned": "alice-user",
          "start_date": "2025-01-15",
          "end_date": "2025-02-15"
        }
      ]
    }
  }
  ```

#### 3. Create Project
- **Method:** `POST`
- **Endpoint:** `/projects/create/`
- **Description:** Creates a new project (Admin/Manager only)
- **Headers:**
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- **Request Body:**
  ```json
  {
    "project_name": "New Project",
    "project_description": "Project description here",
    "status": "planning",
    "start_date": "2025-03-01",
    "end_date": "2025-06-30",
    "assignedUser": "john-manager"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "data": {
      "id": "4",
      "project_name": "New Project",
      "project_description": "Project description here",
      "status": "planning",
      "hours_consumed": 0,
      "start_date": "2025-03-01",
      "end_date": "2025-06-30",
      "assignedUser": "john-manager",
      "tasks": []
    }
  }
  ```

#### 4. Update Project
- **Method:** `PUT`
- **Endpoint:** `/projects/{projectId}`
- **Description:** Updates an existing project
- **Parameters:**
  - `projectId` (path) - The ID of the project to update
- **Headers:**
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- **Request Body:**
  ```json
  {
    "project_name": "Updated Project Name",
    "status": "in_progress",
    "end_date": "2025-07-31"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "data": {
      "id": "1",
      "project_name": "Updated Project Name",
      "status": "in_progress",
      ...
    }
  }
  ```

#### 5. Delete Project
- **Method:** `DELETE`
- **Endpoint:** `/projects/{projectId}`
- **Description:** Deletes a project
- **Parameters:**
  - `projectId` (path) - The ID of the project to delete
- **Headers:**
  ```
  Authorization: Bearer <token>
  ```
- **Response (200 OK):**
  ```json
  {
    "data": {
      "success": true
    }
  }
  ```

---

### Users API

#### 1. Get All Managers
- **Method:** `GET`
- **Endpoint:** `/users?role=MANAGER`
- **Description:** Retrieves all managers (for project assignment)
- **Headers:**
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- **Response (200 OK):**
  ```json
  {
    "data": [
      {
        "id": "john-manager",
        "first_name": "John",
        "last_name": "Manager",
        "email": "john@example.com",
        "username": "john_manager",
        "role": "MANAGER"
      },
      {
        "id": "jane-manager",
        "first_name": "Jane",
        "last_name": "Manager",
        "email": "jane@example.com",
        "username": "jane_manager",
        "role": "MANAGER"
      }
    ]
  }
  ```

#### 2. Get All Users
- **Method:** `GET`
- **Endpoint:** `/users`
- **Description:** Retrieves all users in the system
- **Headers:**
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- **Response (200 OK):**
  ```json
  {
    "data": [
      {
        "id": "john-manager",
        "first_name": "John",
        "last_name": "Manager",
        "email": "john@example.com",
        "username": "john_manager",
        "role": "MANAGER"
      },
      {
        "id": "alice-user",
        "first_name": "Alice",
        "last_name": "User",
        "email": "alice@example.com",
        "username": "alice_user",
        "role": "USER"
      }
    ]
  }
  ```

#### 3. Create User
- **Method:** `POST`
- **Endpoint:** `/users/create/`
- **Description:** Creates a new user (Admin only)
- **Headers:**
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- **Request Body:**
  ```json
  {
    "first_name": "Frank",
    "last_name": "Developer",
    "email": "frank@example.com",
    "username": "frank_dev",
    "password": "securePassword123",
    "role": "USER"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "data": {
      "id": "frank-dev",
      "first_name": "Frank",
      "last_name": "Developer",
      "email": "frank@example.com",
      "username": "frank_dev",
      "role": "USER"
    }
  }
  ```

---

### Tasks API

#### 1. Create Task
- **Method:** `POST`
- **Endpoint:** `/projects/{projectId}/task/create/`
- **Description:** Creates a new task within a project
- **Parameters:**
  - `projectId` (path) - The ID of the project
- **Headers:**
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- **Request Body:**
  ```json
  {
    "task_name": "Backend Development",
    "task_description": "Implement API endpoints",
    "status": "planning",
    "user_assigned": "bob-user",
    "start_date": "2025-03-01",
    "end_date": "2025-04-30"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "data": {
      "id": "t10",
      "task_name": "Backend Development",
      "task_description": "Implement API endpoints",
      "status": "planning",
      "hours_consumed": 0,
      "user_assigned": "bob-user",
      "start_date": "2025-03-01",
      "end_date": "2025-04-30"
    }
  }
  ```

#### 2. Get Available Users for Task
- **Method:** `GET`
- **Endpoint:** `/users?assignable=true&role={userRole}`
- **Description:** Gets users available for task assignment based on role
- **Parameters:**
  - `userRole` (query) - The role of the current user (MANAGER or ADMIN)
- **Headers:**
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- **Example:** `GET /users?assignable=true&role=MANAGER`
- **Response (200 OK):**
  ```json
  {
    "data": [
      {
        "id": "alice-user",
        "first_name": "Alice",
        "last_name": "User",
        "email": "alice@example.com",
        "username": "alice_user",
        "role": "USER"
      },
      {
        "id": "bob-user",
        "first_name": "Bob",
        "last_name": "User",
        "email": "bob@example.com",
        "username": "bob_user",
        "role": "USER"
      }
    ]
  }
  ```

---

## Status Values

Status can be one of the following values:

- `planning` - Project/task is in planning phase
- `in_progress` - Project/task is actively being worked on
- `completed` - Project/task is finished
- `on_hold` - Project/task is temporarily paused
- `overdue` - Project/task has passed the end date

---

## Role-Based Access Control

### Admin
- Full access to all projects, tasks, and users
- Can create, read, update, delete all resources
- Can assign projects to managers

### Manager
- Can view assigned projects
- Can create projects
- Can create tasks
- Can assign tasks to USER role members
- Can view all users in the system

### User
- Can view assigned tasks
- Read-only access to project details
- Cannot create projects or tasks

---

## Testing with Postman

### Step 1: Download and Install Postman
1. Visit [https://www.postman.com/downloads/](https://www.postman.com/downloads/)
2. Download Postman for your operating system
3. Install and open the application

### Step 2: Create a New Collection
1. Click **"+ New"** button at the top left
2. Select **"Collection"**
3. Name it **"Project Management API"**
4. Click **"Create"**

### Step 3: Set Up Environment Variables
1. Click the **gear icon** (Settings) at the top right
2. Go to **"Environments"**
3. Click **"Create"** to create a new environment
4. Name it **"Local Development"**
5. Add variables:
   ```
   Variable Name: base_url
   Initial Value: http://localhost:5000/api/v1
   
   Variable Name: token
   Initial Value: your_token_here
   ```
6. Click **"Save"**
7. Select this environment from the dropdown at the top right

### Step 4: Create Your First Request (GET All Projects)
1. Click the **"+"** tab to create a new request
2. Select **"GET"** from the method dropdown
3. In the URL field, enter: `{{base_url}}/projects`
4. Click on the **"Headers"** tab
5. Add header:
   ```
   Key: Authorization
   Value: Bearer {{token}}
   ```
6. Add header:
   ```
   Key: Content-Type
   Value: application/json
   ```
7. Click **"Send"**
8. You should see the response with all projects

### Step 5: Test GET Single Project
1. Create a new request
2. Select **"GET"**
3. Enter URL: `{{base_url}}/projects/1`
4. Add same headers as above
5. Click **"Send"**

### Step 6: Test CREATE Project
1. Create a new request
2. Select **"POST"**
3. Enter URL: `{{base_url}}/projects/create/`
4. Click the **"Headers"** tab and add the same headers
5. Click the **"Body"** tab
6. Select **"raw"** and choose **"JSON"** from dropdown
7. Paste this JSON:
   ```json
   {
     "project_name": "Test Project",
     "project_description": "This is a test project created from Postman",
     "status": "planning",
     "start_date": "2025-03-15",
     "end_date": "2025-08-30",
     "assignedUser": "john-manager"
   }
   ```
8. Click **"Send"**

### Step 7: Test UPDATE Project
1. Create a new request
2. Select **"PUT"**
3. Enter URL: `{{base_url}}/projects/1` (replace 1 with actual project ID)
4. Add headers
5. Click **"Body"** tab, select **"raw"** and **"JSON"**
6. Paste this JSON:
   ```json
   {
     "project_name": "Updated Project Name",
     "status": "in_progress"
   }
   ```
7. Click **"Send"**

### Step 8: Test DELETE Project
1. Create a new request
2. Select **"DELETE"**
3. Enter URL: `{{base_url}}/projects/4` (use a test project ID)
4. Add headers
5. Click **"Send"**

### Step 9: Test GET All Users
1. Create a new request
2. Select **"GET"**
3. Enter URL: `{{base_url}}/users`
4. Add headers
5. Click **"Send"**

### Step 10: Test CREATE User
1. Create a new request
2. Select **"POST"**
3. Enter URL: `{{base_url}}/users/create/`
4. Add headers
5. Click **"Body"** tab, select **"raw"** and **"JSON"**
6. Paste this JSON:
   ```json
   {
     "first_name": "Test",
     "last_name": "User",
     "email": "testuser@example.com",
     "username": "test_user_123",
     "password": "TestPassword123",
     "role": "USER"
   }
   ```
7. Click **"Send"**

### Step 11: Test CREATE Task
1. Create a new request
2. Select **"POST"**
3. Enter URL: `{{base_url}}/projects/1/task/create/` (replace 1 with actual project ID)
4. Add headers
5. Click **"Body"** tab, select **"raw"** and **"JSON"**
6. Paste this JSON:
   ```json
   {
     "task_name": "Test Task",
     "task_description": "This is a test task",
     "status": "planning",
     "user_assigned": "alice-user",
     "start_date": "2025-03-15",
     "end_date": "2025-04-15"
   }
   ```
7. Click **"Send"**

---

## Error Handling

### Common Error Responses

**401 Unauthorized**
```json
{
  "error": "Unauthorized - Invalid or missing token"
}
```

**403 Forbidden**
```json
{
  "error": "Access denied - insufficient permissions"
}
```

**404 Not Found**
```json
{
  "error": "Resource not found"
}
```

**400 Bad Request**
```json
{
  "error": "Invalid request - missing required fields",
  "details": {
    "project_name": "This field is required"
  }
}
```

---

## Running the Application

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- Backend API running on `http://localhost:5000`

### Frontend Setup
```bash
cd frontendz
npm install
npm start
```

The application will open at `http://localhost:3000`

### Backend Setup
Refer to your backend repository for setup instructions.

---

## Project Structure

```
src/
├── components/          # React UI components
│   ├── Dashboard/      # Main dashboard interface
│   ├── ProjectCreate/  # Create new projects
│   ├── ProjectDetail/  # View and manage project details
│   ├── TaskCreate/     # Create new tasks
│   ├── UserCreate/     # Register new users
│   └── UserList/       # Display users list
├── contexts/           # React Context API
│   └── AuthContext.js  # Authentication state management
├── services/           # API services
│   └── api.js          # API client and endpoints
├── store/              # Redux store
│   ├── store.js        # Store configuration
│   └── slices/         # Redux slices
│       ├── tasksSlice.js    # Tasks reducer
│       └── usersSlice.js    # Users reducer
├── App.js              # Root component
├── index.js            # Application entry point
└── index.css           # Global styles
```

---

## Environment Variables (Frontend)

Create a `.env` file in the `frontendz` directory:

```
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_USE_MOCK=false
```

- `REACT_APP_API_URL` - The base URL of your API
- `REACT_APP_USE_MOCK` - Set to `true` to use mock data instead of real API calls

---

## Key Features

- ✅ Role-based access control (Admin, Manager, User)
- ✅ Project management (Create, Read, Update, Delete)
- ✅ Task management within projects
- ✅ User management
- ✅ Real-time project status tracking
- ✅ Mock data support for development
- ✅ Bearer token authentication
- ✅ Responsive UI with modern design

---

## Technologies Used

- **React** - UI library
- **Redux** - State management
- **Context API** - Authentication state
- **Axios** - HTTP client
- **CSS** - Component styling
- **JavaScript ES6+** - Programming language

---

## Need Help?

Refer to:
- API response examples in this README
- Postman collection for quick testing
- Frontend component documentation in code comments

## Project Overview

This application provides a comprehensive interface for:
- Managing user accounts
- Creating and organizing projects
- Creating and tracking tasks
- Secure user authentication
- Centralized state management

## Project Structure

```
src/
├── components/          # React UI components
│   ├── Dashboard/      # Main dashboard interface
│   ├── ProjectCreate/  # Create new projects
│   ├── ProjectDetail/  # View and manage project details
│   ├── TaskCreate/     # Create new tasks
│   ├── UserCreate/     # Register new users
│   └── UserList/       # Display users list
├── contexts/           # React Context API
│   └── AuthContext.js  # Authentication state management
├── services/           # API services
│   └── api.js          # API client and endpoints
├── store/              # Redux store
│   ├── store.js        # Store configuration
│   └── slices/         # Redux slices
│       ├── tasksSlice.js    # Tasks reducer
│       └── usersSlice.js    # Users reducer
├── App.js              # Root component
├── index.js            # Application entry point
└── index.css           # Global styles
```

## Features

- **User Management** - Create, view, and manage users
- **Project Management** - Create, view, and organize projects
- **Task Management** - Create and track tasks with details
- **Authentication** - Secure user authentication using Context API
- **State Management** - Redux store for centralized state management
- **Responsive Design** - CSS-based styling for all components

## Installation

```bash
npm install
```

## Available Scripts

### `npm start`

Starts the development server. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Runs the test suite in interactive watch mode.

### `npm run build`

Creates an optimized production build.

## Technologies Used

- **React** - UI library
- **Redux** - State management
- **Context API** - Authentication state
- **CSS** - Component styling
- **JavaScript ES6+** - Programming language

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Navigate to the dashboard to begin using the application

## Project Setup

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
#   Q u i z 4 
 
 
