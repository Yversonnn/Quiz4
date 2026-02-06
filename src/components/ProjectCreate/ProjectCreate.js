import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { projectsAPI, usersAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import './ProjectCreate.css';

const ProjectCreate = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const [formData, setFormData] = useState({
    project_name: '',
    project_description: '',
    assignedUser: '',
    start_date: '',
    end_date: '',
  });

  // Check if user is admin
  useEffect(() => {
    if (!hasRole('ADMIN')) {
      navigate('/');
      return;
    }
  }, [hasRole, navigate]);

  // Fetch managers
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        setLoading(true);
        const response = await usersAPI.getManagers();
        setManagers(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load managers. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchManagers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.project_name.trim()) {
      errors.project_name = 'Project name is required';
    }

    if (!formData.assignedUser) {
      errors.assignedUser = 'Please select a manager to assign this project';
    }

    if (!formData.start_date) {
      errors.start_date = 'Start date is required';
    }

    if (!formData.end_date) {
      errors.end_date = 'End date is required';
    }

    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      if (startDate >= endDate) {
        errors.end_date = 'End date must be after start date';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await projectsAPI.createProject({
        project_name: formData.project_name,
        project_description: formData.project_description,
        assignedUser: formData.assignedUser,
        start_date: formData.start_date,
        end_date: formData.end_date,
      });

      // Redirect to dashboard
      navigate('/');
    } catch (err) {
      setError('Failed to create project. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="project-create-container">
        <div className="loading">Loading managers...</div>
      </div>
    );
  }

  return (
    <div className="project-create-container">
      <Link to="/" className="btn btn-back">
        ← Back to Dashboard
      </Link>

      <div className="create-form-wrapper">
        <div className="create-form-header">
          <h1>Create New Project</h1>
          <p>Fill in the details below to create a new project</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="create-form">
          <div className="form-section">
            <h2>Project Details</h2>

            <div className="form-group">
              <label htmlFor="project_name">
                Project Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="project_name"
                name="project_name"
                value={formData.project_name}
                onChange={handleInputChange}
                placeholder="Enter project name"
                className={validationErrors.project_name ? 'input-error' : ''}
              />
              {validationErrors.project_name && (
                <span className="error-text">{validationErrors.project_name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="project_description">Project Description</label>
              <textarea
                id="project_description"
                name="project_description"
                value={formData.project_description}
                onChange={handleInputChange}
                placeholder="Enter project description (optional)"
                rows="4"
              ></textarea>
            </div>
          </div>

          <div className="form-section">
            <h2>Assignment & Timeline</h2>

            <div className="form-group">
              <label htmlFor="assignedUser">
                Assign to Manager <span className="required">*</span>
              </label>
              <select
                id="assignedUser"
                name="assignedUser"
                value={formData.assignedUser}
                onChange={handleInputChange}
                className={validationErrors.assignedUser ? 'input-error' : ''}
              >
                <option value="">-- Select a manager --</option>
                {managers.map((manager) => (
                  <option key={manager.id} value={manager.id}>
                    {manager.name}
                  </option>
                ))}
              </select>
              {validationErrors.assignedUser && (
                <span className="error-text">{validationErrors.assignedUser}</span>
              )}
              <small>Only managers can be assigned as project leads</small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="start_date">
                  Start Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className={validationErrors.start_date ? 'input-error' : ''}
                />
                {validationErrors.start_date && (
                  <span className="error-text">{validationErrors.start_date}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="end_date">
                  End Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className={validationErrors.end_date ? 'input-error' : ''}
                />
                {validationErrors.end_date && (
                  <span className="error-text">{validationErrors.end_date}</span>
                )}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              disabled={submitting}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectCreate;
