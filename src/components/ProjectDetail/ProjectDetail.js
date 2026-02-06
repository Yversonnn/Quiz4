import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { projectsAPI } from '../../services/api';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await projectsAPI.getProjectById(id);
        setProject(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load project. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

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
      overdue: 'Overdue',
      on_hold: 'On Hold',
    };
    return labels[status] || status;
  };

  const calculateProgress = () => {
    if (!project || !project.tasks || project.tasks.length === 0) return 0;
    const completedTasks = project.tasks.filter(
      (t) => t.status === 'completed'
    ).length;
    return Math.round((completedTasks / project.tasks.length) * 100);
  };

  const getProjectStats = () => {
    if (!project) return { totalHours: 0, totalTasks: 0, completedTasks: 0 };
    const completedTasks = project.tasks
      ? project.tasks.filter((t) => t.status === 'completed').length
      : 0;

    return {
      totalHours: project.hours_consumed || 0,
      totalTasks: project.tasks ? project.tasks.length : 0,
      completedTasks,
    };
  };

  if (loading) {
    return (
      <div className="project-detail-container">
        <div className="loading">Loading project details...</div>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="project-detail-container">
        <Link to="/" className="btn btn-back">
          ← Back to Dashboard
        </Link>
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-detail-container">
        <Link to="/" className="btn btn-back">
          ← Back to Dashboard
        </Link>
        <div className="error">Project not found.</div>
      </div>
    );
  }

  const stats = getProjectStats();
  const progress = calculateProgress();

  return (
    <div className="project-detail-container">
      <Link to="/" className="btn btn-back">
        ← Back to Dashboard
      </Link>

      <div className="project-header">
        <div className="header-content">
          <h1>{project.project_name}</h1>
          <p className="project-description">{project.project_description}</p>
          <div className="header-meta">
            <span
              className="status-badge"
              style={{ backgroundColor: getStatusColor(project.status) }}
            >
              {getStatusLabel(project.status)}
            </span>
          </div>
        </div>
      </div>

      <div className="project-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.totalHours}</div>
          <div className="stat-label">Hours Consumed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalTasks}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.completedTasks}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{progress}%</div>
          <div className="stat-label">Progress</div>
        </div>
      </div>

      <div className="project-info-section">
        <h2>Project Information</h2>
        <div className="info-grid">
          <div className="info-card">
            <div className="info-label">Start Date</div>
            <div className="info-value">
              {new Date(project.start_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
          <div className="info-card">
            <div className="info-label">End Date</div>
            <div className="info-value">
              {new Date(project.end_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
          <div className="info-card">
            <div className="info-label">Assigned To</div>
            <div className="info-value">{project.assignedUser || 'Unassigned'}</div>
          </div>
          <div className="info-card">
            <div className="info-label">Status</div>
            <div className="info-value">{getStatusLabel(project.status)}</div>
          </div>
        </div>
      </div>

      <div className="progress-section">
        <h2>Overall Progress</h2>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="progress-text">
          {stats.completedTasks} of {stats.totalTasks} tasks completed
        </p>
      </div>

      <div className="tasks-section">
        <div className="tasks-header">
          <h2>Tasks</h2>
          {user && ['ADMIN', 'MANAGER'].includes(user.role) && (
            <Link to={`/project/${id}/task/create`} className="btn btn-primary">
              + Create Task
            </Link>
          )}
        </div>
        {project.tasks && project.tasks.length > 0 ? (
          <div className="tasks-grid">
            {project.tasks.map((task) => (
              <div key={task.id} className="task-card">
                <div className="task-card-header">
                  <h3>{task.task_name}</h3>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(task.status) }}
                  >
                    {getStatusLabel(task.status)}
                  </span>
                </div>

                <p className="task-card-description">{task.task_description}</p>

                <div className="task-card-meta">
                  <div className="meta-item">
                    <span className="meta-label">Assigned To:</span>
                    <span className="meta-value">{task.user_assigned}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Hours:</span>
                    <span className="meta-value">{task.hours_consumed}h</span>
                  </div>
                </div>

                <div className="task-card-dates">
                  <div className="date-item">
                    <span className="date-label">Start:</span>
                    <span className="date-value">
                      {new Date(task.start_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="date-item">
                    <span className="date-label">Due:</span>
                    <span className="date-value">
                      {new Date(task.end_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-tasks-message">
            <p>No tasks assigned to this project yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
