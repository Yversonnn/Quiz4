import axios from 'axios';

// Configure API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mock data for development
const mockProjects = [
  {
    id: '1',
    project_name: 'Website Redesign',
    project_description: 'Complete redesign of company website with modern UI/UX',
    status: 'in_progress',
    hours_consumed: 45,
    start_date: '2025-01-15',
    end_date: '2025-06-30',
    assignedUser: 'john-manager',
    tasks: [
      {
        id: 't1',
        task_name: 'UI Design',
        task_description: 'Create new UI mockups',
        status: 'completed',
        hours_consumed: 20,
        user_assigned: 'alice-user',
        start_date: '2025-01-15',
        end_date: '2025-02-15',
      },
      {
        id: 't2',
        task_name: 'Frontend Development',
        task_description: 'Implement React components',
        status: 'in_progress',
        hours_consumed: 25,
        user_assigned: 'bob-user',
        start_date: '2025-02-16',
        end_date: '2025-05-31',
      },
    ],
  },
  {
    id: '2',
    project_name: 'Mobile App Development',
    project_description: 'Native iOS and Android app',
    status: 'planning',
    hours_consumed: 15,
    start_date: '2025-02-01',
    end_date: '2025-08-31',
    assignedUser: 'jane-manager',
    tasks: [
      {
        id: 't3',
        task_name: 'Requirements Analysis',
        task_description: 'Gather and document requirements',
        status: 'in_progress',
        hours_consumed: 15,
        user_assigned: 'charlie-user',
        start_date: '2025-02-01',
        end_date: '2025-02-28',
      },
    ],
  },
  {
    id: '3',
    project_name: 'Database Migration',
    project_description: 'Migrate legacy database to PostgreSQL',
    status: 'completed',
    hours_consumed: 80,
    start_date: '2024-12-01',
    end_date: '2025-01-31',
    assignedUser: 'john-manager',
    tasks: [
      {
        id: 't4',
        task_name: 'Data Mapping',
        task_description: 'Map old schema to new schema',
        status: 'completed',
        hours_consumed: 30,
        user_assigned: 'david-user',
        start_date: '2024-12-01',
        end_date: '2024-12-20',
      },
      {
        id: 't5',
        task_name: 'Migration Script',
        task_description: 'Write and test migration scripts',
        status: 'completed',
        hours_consumed: 50,
        user_assigned: 'eve-user',
        start_date: '2024-12-21',
        end_date: '2025-01-31',
      },
    ],
  },
];

const mockUsers = [
  { id: 'john-manager', first_name: 'John', last_name: 'Manager', email: 'john@example.com', username: 'john_manager', role: 'MANAGER' },
  { id: 'jane-manager', first_name: 'Jane', last_name: 'Manager', email: 'jane@example.com', username: 'jane_manager', role: 'MANAGER' },
  { id: 'alice-user', first_name: 'Alice', last_name: 'User', email: 'alice@example.com', username: 'alice_user', role: 'USER' },
  { id: 'bob-user', first_name: 'Bob', last_name: 'User', email: 'bob@example.com', username: 'bob_user', role: 'USER' },
  { id: 'charlie-user', first_name: 'Charlie', last_name: 'User', email: 'charlie@example.com', username: 'charlie_user', role: 'USER' },
  { id: 'david-user', first_name: 'David', last_name: 'User', email: 'david@example.com', username: 'david_user', role: 'USER' },
  { id: 'eve-user', first_name: 'Eve', last_name: 'User', email: 'eve@example.com', username: 'eve_user', role: 'USER' },
];

// Projects API
export const projectsAPI = {
  // Get all projects (Admin) or assigned projects (Manager/User)
  getProjects: async (userRole) => {
    try {
      if (process.env.REACT_APP_USE_MOCK === 'true') {
        // Return all projects for admin, filtered for others
        if (userRole === 'ADMIN') {
          return { data: mockProjects };
        } else {
          // For manager/user, would filter by assignment
          return { data: mockProjects };
        }
      }
      return await api.get('/projects');
    } catch (error) {
      console.error('Error fetching projects:', error);
      if (process.env.REACT_APP_USE_MOCK === 'true') {
        return { data: mockProjects };
      }
      throw error;
    }
  },

  // Get single project by ID
  getProjectById: async (projectId) => {
    try {
      if (process.env.REACT_APP_USE_MOCK === 'true') {
        const project = mockProjects.find((p) => p.id === projectId);
        if (!project) {
          throw new Error('Project not found');
        }
        return { data: project };
      }
      return await api.get(`/projects/${projectId}`);
    } catch (error) {
      console.error('Error fetching project:', error);
      if (process.env.REACT_APP_USE_MOCK === 'true') {
        const project = mockProjects.find((p) => p.id === projectId);
        if (project) {
          return { data: project };
        }
      }
      throw error;
    }
  },

  // Create a new project
  createProject: async (projectData) => {
    try {
      if (process.env.REACT_APP_USE_MOCK === 'true') {
        const newProject = {
          id: String(mockProjects.length + 1),
          ...projectData,
          hours_consumed: 0,
          tasks: [],
        };
        mockProjects.push(newProject);
        return { data: newProject };
      }
      return await api.post('/projects/create/', projectData);
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  // Update project
  updateProject: async (projectId, projectData) => {
    try {
      if (process.env.REACT_APP_USE_MOCK === 'true') {
        const index = mockProjects.findIndex((p) => p.id === projectId);
        if (index !== -1) {
          mockProjects[index] = { ...mockProjects[index], ...projectData };
          return { data: mockProjects[index] };
        }
        throw new Error('Project not found');
      }
      return await api.put(`/projects/${projectId}`, projectData);
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  // Delete project
  deleteProject: async (projectId) => {
    try {
      if (process.env.REACT_APP_USE_MOCK === 'true') {
        const index = mockProjects.findIndex((p) => p.id === projectId);
        if (index !== -1) {
          mockProjects.splice(index, 1);
          return { data: { success: true } };
        }
        throw new Error('Project not found');
      }
      return await api.delete(`/projects/${projectId}`);
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },
};

// Users API
export const usersAPI = {
  // Get all managers (for project assignment)
  getManagers: async () => {
    try {
      if (process.env.REACT_APP_USE_MOCK === 'true') {
        return { data: mockUsers.filter((u) => u.role === 'MANAGER') };
      }
      return await api.get('/users?role=MANAGER');
    } catch (error) {
      console.error('Error fetching managers:', error);
      if (process.env.REACT_APP_USE_MOCK === 'true') {
        return { data: mockUsers.filter((u) => u.role === 'MANAGER') };
      }
      throw error;
    }
  },

  // Get all users
  getAllUsers: async () => {
    try {
      if (process.env.REACT_APP_USE_MOCK === 'true') {
        return { data: mockUsers };
      }
      return await api.get('/users');
    } catch (error) {
      console.error('Error fetching users:', error);
      if (process.env.REACT_APP_USE_MOCK === 'true') {
        return { data: mockUsers };
      }
      throw error;
    }
  },

  // Create a new user
  createUser: async (userData) => {
    try {
      if (process.env.REACT_APP_USE_MOCK === 'true') {
        const newUser = {
          id: `user-${mockUsers.length + 1}`,
          ...userData,
        };
        mockUsers.push(newUser);
        return { data: newUser };
      }
      return await api.post('/users/create/', userData);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },
};

// Tasks API
export const tasksAPI = {
  // Create a task for a project
  createTask: async (projectId, taskData) => {
    try {
      if (process.env.REACT_APP_USE_MOCK === 'true') {
        const projectIndex = mockProjects.findIndex((p) => p.id === projectId);
        if (projectIndex !== -1) {
          const newTask = {
            id: `t${mockProjects[projectIndex].tasks.length + 1}`,
            ...taskData,
            status: 'planning',
            hours_consumed: 0,
          };
          mockProjects[projectIndex].tasks.push(newTask);
          return { data: newTask };
        }
        throw new Error('Project not found');
      }
      return await api.post(`/projects/${projectId}/task/create/`, taskData);
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Get available users for task assignment based on role
  getAvailableUsersForTask: async (userRole) => {
    try {
      if (process.env.REACT_APP_USE_MOCK === 'true') {
        // If assigning as MANAGER, show only USER role users
        // If assigning as ADMIN, show MANAGER and USER roles
        if (userRole === 'MANAGER') {
          return { data: mockUsers.filter((u) => u.role === 'USER') };
        } else if (userRole === 'ADMIN') {
          return { data: mockUsers.filter((u) => u.role === 'MANAGER' || u.role === 'USER') };
        }
        return { data: [] };
      }
      return await api.get(`/users?assignable=true&role=${userRole}`);
    } catch (error) {
      console.error('Error fetching available users:', error);
      if (process.env.REACT_APP_USE_MOCK === 'true') {
        if (userRole === 'MANAGER') {
          return { data: mockUsers.filter((u) => u.role === 'USER') };
        } else if (userRole === 'ADMIN') {
          return { data: mockUsers.filter((u) => u.role === 'MANAGER' || u.role === 'USER') };
        }
      }
      throw error;
    }
  },
};

export default api;
