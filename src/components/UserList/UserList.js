import React, { useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AuthContext } from '../../contexts/AuthContext';
import { fetchAllUsers } from '../../store/slices/usersSlice';
import './UserList.css';

const UserList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);

  const { users, loading, error } = useSelector((state) => state.users);

  // Check permission - only ADMIN
  const hasPermission = user && user.role === 'ADMIN';

  useEffect(() => {
    if (!hasPermission) {
      navigate('/');
      return;
    }
    dispatch(fetchAllUsers());
  }, [user, dispatch, hasPermission, navigate]);

  if (!hasPermission) {
    return null;
  }

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <div>
          <Link to="/" className="btn btn-back">
            ← Back to Dashboard
          </Link>
          <h1>User Management</h1>
        </div>
        <Link to="/users/create" className="btn btn-primary">
          + Create New User
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : users && users.length > 0 ? (
        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.first_name}</td>
                  <td>{u.last_name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`role-badge role-${u.role.toLowerCase()}`}>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-data">No users found</div>
      )}
    </div>
  );
};

export default UserList;
