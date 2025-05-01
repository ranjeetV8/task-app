import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createTask, updateTask, fetchTaskById } from '../services/api';

function TaskForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
  });

  const loadTaskData = async () => {
    try {
      setLoading(true);
      const task = await fetchTaskById(id);
      const formattedDate = new Date(task.dueDate).toISOString().split("T")[0];

      setFormData({
        title: task.title,
        description: task.description,
        dueDate: formattedDate,
        priority: task.priority,
      });
      setLoading(false);
    } catch (err) {
      setError("Failed to load task data.");
      setLoading(false);
    }
  };

  // Load task data if in edit mode
  useEffect(() => {
    if (id) {
      setIsEdit(true);
      loadTaskData();
    }
  }, [id]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title || !formData.dueDate) {
      setError("Title and due date are required");
      return;
    }

    try {
      setLoading(true);
      if (isEdit) {
        await updateTask(id, formData);
      } else {
        await createTask(formData);
      }
      setLoading(false);
      navigate("/"); // Redirect to task list after submission
    } catch (err) {
      setError("Failed to save task. Please try again.");
      setLoading(false);
    }
  };

  if (loading && isEdit)
    return <div className="loading">Loading task data...</div>;

  return (
    <div className="task-form-container">
      <h2>{isEdit ? "Edit Task" : "Create New Task"}</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="cancel-btn"
          >
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Saving..." : isEdit ? "Update Task" : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
        