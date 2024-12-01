import React, { useState } from 'react';

const TaskItem = ({ task, onToggleComplete, onDelete }) => {
  const [showModal, setShowModal] = useState(false);  // State to manage modal visibility

  // Check if the task is overdue (only tasks with dueDate are considered)
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  const isCompleted = task.completed;  // Check if task is marked as completed

  // Toggle the modal visibility
  const handleModalToggle = () => {
    setShowModal(!showModal);  // Toggle modal visibility state
  };

  // Truncate the text if it exceeds a certain length
  const truncateText = (text, maxLength) => {
    if (typeof text !== 'string') return '';  // If text is not a string, return an empty string
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <div className={`task-item ${isCompleted ? 'completed' : ''}`}>

      <div className="task-text-container">
        {/* Display the task title, click to toggle the task completion state */}
        <span
          className={`task-text ${isCompleted ? 'completed' : ''}`}
          onClick={() => onToggleComplete(task.id)}
        >
          {truncateText(task.title, 40)}  {/* Truncate title to 40 chars */}
        </span>

        {/* Display due date if exists, placed between title and description */}
        {task.dueDate && (
          <div className="task-due-date">
            <span 
              style={{ color: isOverdue && !isCompleted ? 'red' : 'inherit', fontSize: '0.8rem' }}  // Red color for overdue dates only
            >
              Due: {new Date(task.dueDate).toLocaleString()}
            </span>
          </div>
        )}

        {/* Display the task description with truncation */}
        <span
          className={`task-description ${isCompleted ? 'completed' : ''}`}
          onClick={handleModalToggle}
        >
          {truncateText(task.description, 70)}  {/* Truncate description to 70 chars */}
        </span>
      </div>

      <div className="task-actions">
        {/* Complete/Undo buttons */}
        {!isCompleted ? (
          <button
            className="toggle-btn complete-btn"
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete(task.id);
            }}
          >
            <span className="material-icons">check_circle</span>
          </button>
        ) : (
          <button
            className="toggle-btn undo-btn"
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete(task.id);
            }}
          >
            <span className="material-icons">undo</span>
          </button>
        )}

        {/* Delete button */}
        <button
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
        >
          <span className="material-icons">delete</span>
        </button>
      </div>

      {/* Modal for full task description */}
      {showModal && (
        <div className="modal-overlay" onClick={handleModalToggle}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            {task.dueDate && (
              <p>
                <strong>Due Date:</strong> {new Date(task.dueDate).toLocaleString()}
              </p>
            )}
            <button onClick={handleModalToggle}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
