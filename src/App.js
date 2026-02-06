import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './components/Dashboard/Dashboard';
import ProjectDetail from './components/ProjectDetail/ProjectDetail';
import ProjectCreate from './components/ProjectCreate/ProjectCreate';
import TaskCreate from './components/TaskCreate/TaskCreate';
import UserList from './components/UserList/UserList';
import UserCreate from './components/UserCreate/UserCreate';
import './App.css';

function AppContent() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/projects/create" element={<ProjectCreate />} />
        <Route path="/project/:id/task/create" element={<TaskCreate />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/create" element={<UserCreate />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Provider>
  );
}

export default App;
