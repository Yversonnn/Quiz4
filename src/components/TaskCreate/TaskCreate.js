import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AuthContext } from '../../contexts/AuthContext';
import { createTask, fetchAvailableUsers } from '../../store/slices/tasksSlice';
import './TaskCreate.css';

const TaskCreate = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    task_name: '',
    task_description: '',
    user_assigned: '',
    start_date: '',
    end_date: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);

  const { loading, error, availableUsers, usersLoading } = useSelector(
    (state) => state.tasks
  );

  // Check permission
  const hasPermission = user && ['ADMIN', 'MANAGER'].includes(user.role);

  useEffect(() => {
    if (!hasPermission) {
      navigate('/');
      return;
    }
    // Fetch available users based on current user's role
    dispatch(fetchAvailableUsers(user.role));
  }, [user, dispatch, hasPermission, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.task_name.trim()) {
      errors.task_name = 'Task name is required';
    }
    if (!formData.user_assigned) {
      errors.user_assigned = 'User assignment is required';
    }
    if (!formData.start_date) {
      errors.start_date = 'Start date is required';
    }
    if (!formData.end_date) {
      errors.end_date = 'End date is required';
    }
    if (formData.start_date && formData.end_date) {
      if (new Date(formData.start_date) > new Date(formData.end_date)) {
        errors.end_date = 'End date must be after start date';
      }
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSubmitError(null);
      await dispatch(createTask(projectId, formData));
      navigate(`/projects/${projectId}`);
    } catch (err) {
      setSubmitError(error || 'Failed to create task. Please try again.');
    }
  };

  if (!hasPermission) {
    return null;
  }

  return (
    <div className="task-create-container">
      <div className="task-create-form">
        <Link to={`/projects/${projectId}`} className="btn btn-back">
          ← Back to Project
        </Link>

        <h1>Create New Task</h1>

        {submitError && <div className="error-message">{submitError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="task_name">Task Name *</label>
            <input
              type="text"
              id="task_name"
              name="task_name"
              value={formData.task_name}
              onChange={handleChange}
              placeholder="Enter task name"
              className={formErrors.task_name ? 'input-error' : ''}
            />
            {formErrors.task_name && (
              <span className="field-error">{formErrors.task_name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="task_description">Task Description</label>
            <textarea
              id="task_description"
              name="task_description"
              value={formData.task_description}
              onChange={handleChange}
              placeholder="Enter task description (optional)"
              rows="4"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="user_assigned">Assign User *</label>
            {usersLoading ? (
              <p className="loading-text">Loading users...</p>
            ) : (
              <select
                id="user_assigned"
                name="user_assigned"
                value={formData.user_assigned}
                onChange={handleChange}
                className={formErrors.user_assigned ? 'input-error' : ''}
              >
                <option value="">Select a user</option>
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name} ({user.role})
                  </option>
                ))}
              </select>
            )}
            {formErrors.user_assigned && (
              <span className="field-error">{formErrors.user_assigned}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start_date">Start Date *</label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className={formErrors.start_date ? 'input-error' : ''}
              />
              {formErrors.start_date && (
                <span className="field-error">{formErrors.start_date}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="end_date">End Date *</label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className={formErrors.end_date ? 'input-error' : ''}
              />
              {formErrors.end_date && (
                <span className="field-error">{formErrors.end_date}</span>
              )}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating Task...' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskCreate;
