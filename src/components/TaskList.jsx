import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchTasks, deleteTask } from '../services/api';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("dueDate");
  const [error, setError] = useState(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await fetchTasks();
      setTasks(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch tasks. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id);
        loadTasks(); // Reload tasks after deletion
      } catch (err) {
        setError("Failed to delete task. Please try again.");
      }
    }
  };

  const handleSort = (sortOption) => {
    setSortBy(sortOption);
  };

  // Sort tasks based on the selected option
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === "dueDate") {
      return new Date(a.dueDate) - new Date(b.dueDate);
    } else if (sortBy === "priority") {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return 0;
  });

  if (loading) return <div className="loading">Loading tasks...</div>;

  return (
    <div className="task-list-container">
      <h2>My Tasks</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="sorting-options">
        <span>Sort by: </span>
        <button
          className={sortBy === "dueDate" ? "active" : ""}
          onClick={() => handleSort("dueDate")}
        >
          Due Date
        </button>
        <button
          className={sortBy === "priority" ? "active" : ""}
          onClick={() => handleSort("priority")}
        >
          Priority
        </button>
      </div>
      {tasks.length === 0 ? (
        <p className="no-tasks">No tasks found. Create your first task!</p>
      ) : (
        <div className="task-list">
          {sortedTasks.map((task) => (
            <div className="task-card" key={task._id}>
              <div
                className={`priority-indicator priority-${task.priority.toLowerCase()}`}
              ></div>
              <h3>{task.title}</h3>
              <p className="task-description">
                {task.description.substring(0, 100)}...
              </p>
              <p className="task-due-date">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
              <div className="task-card-actions">
                <Link to={`/task/${task._id}`} className="view-btn">
                  View
                </Link>
                <Link to={`/edit/${task._id}`} className="edit-btn">
                  Edit
                </Link>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(task._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;