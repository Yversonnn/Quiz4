import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AuthContext } from '../../contexts/AuthContext';
import { createUser } from '../../store/slices/usersSlice';
import './UserCreate.css';

const UserCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    role: 'USER',
    password: '',
    password_confirm: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);

  const { creatingUser, error } = useSelector((state) => state.users);

  // Check permission - only ADMIN
  const hasPermission = user && user.role === 'ADMIN';

  useEffect(() => {
    if (!hasPermission) {
      navigate('/');
    }
  }, [hasPermission, navigate]);

  if (!hasPermission) {
    return null;
  }

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
    if (!formData.first_name.trim()) {
      errors.first_name = 'First name is required';
    }
    if (!formData.last_name.trim()) {
      errors.last_name = 'Last name is required';
    }
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.password_confirm) {
      errors.password_confirm = 'Passwords do not match';
    }
    if (!formData.role) {
      errors.role = 'Role is required';
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
      const userData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        username: formData.username,
        email: formData.email,
        role: formData.role,
        password: formData.password,
      };
      await dispatch(createUser(userData));
      navigate('/users');
    } catch (err) {
      setSubmitError(error || 'Failed to create user. Please try again.');
    }
  };

  if (!hasPermission) {
    return null;
  }

  return (
    <div className="user-create-container">
      <div className="user-create-form">
        <Link to="/users" className="btn btn-back">
          ← Back to Users
        </Link>

        <h1>Create New User</h1>

        {submitError && <div className="error-message">{submitError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name">First Name *</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter first name"
                className={formErrors.first_name ? 'input-error' : ''}
              />
              {formErrors.first_name && (
                <span className="field-error">{formErrors.first_name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Last Name *</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Enter last name"
                className={formErrors.last_name ? 'input-error' : ''}
              />
              {formErrors.last_name && (
                <span className="field-error">{formErrors.last_name}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="username">Username *</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                className={formErrors.username ? 'input-error' : ''}
              />
              {formErrors.username && (
                <span className="field-error">{formErrors.username}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className={formErrors.email ? 'input-error' : ''}
              />
              {formErrors.email && (
                <span className="field-error">{formErrors.email}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className={formErrors.password ? 'input-error' : ''}
              />
              {formErrors.password && (
                <span className="field-error">{formErrors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password_confirm">Confirm Password *</label>
              <input
                type="password"
                id="password_confirm"
                name="password_confirm"
                value={formData.password_confirm}
                onChange={handleChange}
                placeholder="Confirm password"
                className={formErrors.password_confirm ? 'input-error' : ''}
              />
              {formErrors.password_confirm && (
                <span className="field-error">{formErrors.password_confirm}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="role">Role *</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={formErrors.role ? 'input-error' : ''}
            >
              <option value="USER">User</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
            {formErrors.role && (
              <span className="field-error">{formErrors.role}</span>
            )}
          </div>

          <button type="submit" className="btn btn-primary" disabled={creatingUser}>
            {creatingUser ? 'Creating User...' : 'Create User'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserCreate;
