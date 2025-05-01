
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchTaskById, deleteTask } from '../services/api';

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTaskDetails = async () => {
    try {
      setLoading(true);
      const data = await fetchTaskById(id);
      setTask(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load task details.");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTaskDetails();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id);
        navigate("/"); // Redirect to task list after deletion
      } catch (err) {
        setError("Failed to delete task. Please try again.");
      }
    }
  };

  if (loading) return <div className="loading">Loading task details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!task) return <div className="not-found">Task not found</div>;

  return (
    <div className="task-details-container">
      <h2>Task Details</h2>
      <div className="task-details-card">
        <div
          className={`task-priority priority-${task.priority.toLowerCase()}`}
        >
          {task.priority} Priority
        </div>

        <h3 className="task-title">{task.title}</h3>

        <div className="task-info">
          <p>
            <strong>Due Date:</strong>{" "}
            {new Date(task.dueDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Created:</strong>{" "}
            {new Date(task.createdAt).toLocaleDateString()}
          </p>
          {task.updatedAt && (
            <p>
              <strong>Last Updated:</strong>{" "}
              {new Date(task.updatedAt).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="task-description">
          <h4>Description</h4>
          <p>{task.description || "No description provided."}</p>
        </div>

        <div className="task-actions">
          <Link to={`/edit/${task._id}`} className="edit-btn">
            Edit Task
          </Link>
          <button onClick={handleDelete} className="delete-btn">
            Delete Task
          </button>
          <button onClick={() => navigate("/")} className="back-btn">
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;