import React, { useState } from 'react';

// TaskItem component to display individual tasks
const TaskItem = ({ task, onToggleComplete, onDelete }) => {
  const [showModal, setShowModal] = useState(false);  // State to manage modal visibility

  // Toggle the modal visibility
  const handleModalToggle = () => {
    setShowModal(!showModal);  // Toggle modal visibility state
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-text-container">
        {/* Display the task title, click to toggle the task completion state */}
        <span
          className={`task-text ${task.completed ? 'completed' : ''}`}  // Add 'completed' class if task is completed
          onClick={() => onToggleComplete(task.id)}  // Click task title to toggle completion state
        >
          {task.title} {/* Display task title */}
        </span>

        {/* Display the task description in the task container */}
        <span
          className={`task-description ${task.completed ? 'completed' : ''}`} 
          onClick={handleModalToggle}  // Toggle modal on description click
        >
          {task.description.slice(0, 50)}... {/* Show truncated task description */}
        </span>
      </div>

      {/* Buttons for toggling completion state and deleting the task */}
      <div className="task-actions">
        {/* Use Material Icon for icons */}
        {!task.completed ? (
          <button
            className="toggle-btn complete-btn"
            onClick={(e) => {
              e.stopPropagation();  // Prevent click event from propagating
              onToggleComplete(task.id);  // Toggle task completion state when clicked
            }}
          >
            <span className="material-icons">check_circle</span> {/* Complete icon */}
          </button>
        ) : (
          <button
            className="toggle-btn undo-btn"
            onClick={(e) => {
              e.stopPropagation();  // Prevent click event from propagating
              onToggleComplete(task.id);  // Undo task completion when clicked
            }}
          >
            <span className="material-icons">undo</span> {/* Undo icon */}
          </button>
        )}

        {/* Delete button */}
        <button
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();  // Prevent click event from propagating
            onDelete(task.id);  // Delete task when clicked
          }}
        >
          <span className="material-icons">delete</span> {/* Delete icon */}
        </button>
      </div>

      {/* Modal for displaying full task description */}
      {showModal && (
        <div className="modal-overlay" onClick={handleModalToggle}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <button onClick={handleModalToggle}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
