import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import './TasksPage.css';

const TasksPage = ({ userId }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({ description: '', status: '' });
  const [error, setError] = useState('');
  const [statusUpdate, setStatusUpdate] = useState({}); // For tracking status updates
  const [isFormVisible, setIsFormVisible] = useState(false); // Track form visibility
  const [isModifyMode, setIsModifyMode] = useState(null); // Track the task being modified

  useEffect(() => {
    if (!userId) return;
    fetchTasks();
  }, [userId]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get(`http://localhost:5148/api/task`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userTasks = response.data.$values.filter((task) => task.userId === userId);
      setTasks(userTasks || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.description || !newTask.status) {
      setError('Description and Status are required.');
      return;
    }
    setError('');
    const taskWithUser = { ...newTask, userId };
    try {
      const token = await getAccessTokenSilently();
      await axios.post('http://localhost:5148/api/task', taskWithUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
      setNewTask({ description: '', status: '' });
      setIsFormVisible(false);
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Failed to add task. Try again.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const token = await getAccessTokenSilently();
      await axios.delete(`http://localhost:5148/api/task/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Try again.');
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    setStatusUpdate((prevState) => ({ ...prevState, [taskId]: newStatus }));
  };

  const updateTaskStatus = async (task) => {
    const updatedTask = {
      ...task,
      status: statusUpdate[task.id] || task.status,
    };
    try {
      const token = await getAccessTokenSilently();
      await axios.put(`http://localhost:5148/api/task/${task.id}`, updatedTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
      setIsModifyMode(null); // Exit modify mode
      alert('Task status updated successfully!');
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update task status. Try again.');
    }
  };

  const toggleFormVisibility = () => {
    setIsFormVisible((prevState) => !prevState);
  };

  const toggleModifyMode = (taskId) => {
    setIsModifyMode(taskId === isModifyMode ? null : taskId);
  };

  if (loading) return <div>Loading tasks...</div>;

  return (
    <div className="tasks-page">
      <h1>Tasks</h1>

      {tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className="task-item">
              <div className="task-info">
                <p>{task.description} - {task.status}</p>

                {isModifyMode === task.id ? (
                  <select
                    value={statusUpdate[task.id] || task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="In Review">In Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                ) : null}
              </div>

              <div className="task-actions">
                {isModifyMode === task.id ? (
                  <>
                    <button
                      onClick={() => updateTaskStatus(task)}
                      className="update-button"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => setIsModifyMode(null)}
                      className="cancel-button"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => toggleModifyMode(task.id)}
                      className="modify-button"
                    >
                      Modify
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={toggleFormVisibility}
        className="toggle-form-button"
      >
        {isFormVisible ? 'Cancel' : 'Assign a New Task'}
      </button>

      {isFormVisible && (
        <form onSubmit={handleAddTask} className="task-form active">
          <h2>Assign a New Task</h2>
          <div>
            <label>
              Description:
              <input
                type="text"
                name="description"
                value={newTask.description}
                onChange={handleInputChange}
                className="input-field"
              />
            </label>
          </div>
          <div>
            <label>
              Status:
              <select
                name="status"
                value={newTask.status}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="">Select Status</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="In Review">In Review</option>
                <option value="Completed">Completed</option>
              </select>
            </label>
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="submit-button">
            Add Task
          </button>
          <button
            type="button"
            onClick={() => setIsFormVisible(false)}
            className="cancel-form-button"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default TasksPage;
