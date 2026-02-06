import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const { user, hasRole } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await projectsAPI.getProjects(user.role);
        setProjects(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch projects. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user.role]);

  const toggleExpand = (projectId) => {
    setExpandedProjectId(expandedProjectId === projectId ? null : projectId);
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: '#4caf50',
      in_progress: '#2196f3',
      planning: '#ff9800',
      on_hold: '#f44336',
    };
    return colors[status] || '#666';
  };

  const getStatusLabel = (status) => {
    const labels = {
      completed: 'Completed',
      in_progress: 'In Progress',
      planning: 'Planning',
      on_hold: 'On Hold',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-top">
          <h1>Projects Dashboard</h1>
          <p>Welcome, {user.name} ({user.role})</p>
        </div>
        <div className="header-actions">
          {hasRole('ADMIN') && (
            <div className="admin-menu">
              <Link to="/users" className="btn btn-secondary">
                👥 User Management
              </Link>
              <Link to="/users/create" className="btn btn-secondary">
                ➕ Create User
              </Link>
            </div>
          )}
          {hasRole('ADMIN') && (
            <Link to="/projects/create" className="btn btn-primary">
              + Create Project
            </Link>
          )}
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="no-projects">
          <p>No projects found.</p>
          {hasRole('ADMIN') && (
            <Link to="/projects/create" className="btn btn-primary">
              Create your first project
            </Link>
          )}
        </div>
      ) : (
        <div className="projects-table-container">
          <table className="projects-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Hours</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <React.Fragment key={project.id}>
                  <tr
                    className={`project-row ${
                      expandedProjectId === project.id ? 'expanded' : ''
                    }`}
                  >
                    <td className="project-name-cell">
                      <button
                        className="expand-btn"
                        onClick={() => toggleExpand(project.id)}
                      >
                        {expandedProjectId === project.id ? '▼' : '▶'}
                      </button>
                      <span>{project.project_name}</span>
                    </td>
                    <td>
                      <span
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(project.status) }}
                      >
                        {getStatusLabel(project.status)}
                      </span>
                    </td>
                    <td>{new Date(project.start_date).toLocaleDateString()}</td>
                    <td>{new Date(project.end_date).toLocaleDateString()}</td>
                    <td className="hours-cell">{project.hours_consumed}h</td>
                    <td className="actions-cell">
                      <Link
                        to={`/projects/${project.id}`}
                        className="btn btn-small btn-info"
                      >
                        View
                      </Link>
                    </td>
                  </tr>

                  {expandedProjectId === project.id && (
                    <tr className="accordion-row">
                      <td colSpan="6">
                        <div className="accordion-content">
                          <div className="accordion-section">
                            <h3>Project Details</h3>
                            <div className="project-details">
                              <div className="detail-item">
                                <span className="label">Description:</span>
                                <span className="value">
                                  {project.project_description || 'No description'}
                                </span>
                              </div>
                              <div className="detail-item">
                                <span className="label">Assigned User:</span>
                                <span className="value">
                                  {project.assignedUser || 'Unassigned'}
                                </span>
                              </div>
                              <div className="detail-item">
                                <span className="label">Total Hours:</span>
                                <span className="value">{project.hours_consumed} hours</span>
                              </div>
                            </div>
                          </div>

                          <div className="accordion-section">
                            <h3>Tasks ({project.tasks?.length || 0})</h3>
                            {project.tasks && project.tasks.length > 0 ? (
                              <div className="tasks-list">
                                {project.tasks.map((task) => (
                                  <div key={task.id} className="task-item">
                                    <div className="task-header">
                                      <h4>{task.task_name}</h4>
                                      <span
                                        className="status-badge"
                                        style={{
                                          backgroundColor: getStatusColor(task.status),
                                        }}
                                      >
                                        {getStatusLabel(task.status)}
                                      </span>
                                    </div>
                                    <p className="task-description">
                                      {task.task_description}
                                    </p>
                                    <div className="task-meta">
                                      <span>
                                        <strong>Assigned to:</strong> {task.user_assigned}
                                      </span>
                                      <span>
                                        <strong>Hours:</strong> {task.hours_consumed}h
                                      </span>
                                      <span>
                                        <strong>Due:</strong>{' '}
                                        {new Date(
                                          task.end_date
                                        ).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="no-tasks">No tasks assigned yet.</p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
