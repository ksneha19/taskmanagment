import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import TasksPage from '../Tasks/TasksPage'; // Import TasksPage
import './UsersPage.css'; // Import the CSS file

const UsersPage = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [error, setError] = useState('');
  const [isAddingUser, setIsAddingUser] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get('http://localhost:5148/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.$values || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      setError('Name and Email are required');
      return;
    }

    setError('');
    try {
      const token = await getAccessTokenSilently();
      await axios.post('http://localhost:5148/api/user', newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUsers();
      setNewUser({ name: '', email: '' });
      setIsAddingUser(false); // Hide form after submission
    } catch (error) {
      console.error('Error adding user:', error);
      setError('Failed to add user. Try again.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user and their tasks?')) return;

    try {
      const token = await getAccessTokenSilently();
      await axios.delete(`http://localhost:5148/api/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Try again.');
    }
  };

  const handleCancelAddUser = () => {
    setIsAddingUser(false); // Hide the form
    setNewUser({ name: '', email: '' }); // Reset the form fields
    setError(''); // Clear any error messages
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="users-page-container">
      {/* Only show this message when no user is selected */}
      {!selectedUserId && <h1>List of Users available to perform tasks:</h1>}

      {selectedUserId ? (
        <div>
          <TasksPage userId={selectedUserId} />
          <button onClick={() => setSelectedUserId(null)} className="back-button">
            Back to Users
          </button>
        </div>
      ) : (
        <>
          <ul className="users-list">
            {users.length === 0 ? (
              <p>No users found</p>
            ) : (
              users.map((user) => (
                <li key={user.id} className="user-item">
                  <span className="user-name">{user.name} ({user.email})</span>
                  <div className="user-actions">
                    <button
                      onClick={() => setSelectedUserId(user.id)}
                      className="view-tasks-button"
                    >
                      View Tasks
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>

          <button
            onClick={() => setIsAddingUser(true)}
            className="add-user-button"
          >
            Add new User
          </button>

          {isAddingUser && (
            <form onSubmit={handleAddUser} className="add-user-form">
              <h2>Add New User</h2>
              <div className="form-field">
                <label>
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={newUser.name}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </label>
              </div>
              <div className="form-field">
                <label>
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </label>
              </div>
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="submit-button">
                Add User
              </button>
              <button type="button" onClick={handleCancelAddUser} className="cancel-button">
                Cancel
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default UsersPage;
