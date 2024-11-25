// src/TaskItem.js
import React from 'react';

const TaskItem = ({ task, onToggleComplete, onDelete }) => {
  return (
    <div className="task-item">
      <div className="task-text-container">
        {/* Display the task title, click to toggle the task completion state */}
        <span
          className={`task-text ${task.completed ? 'completed' : ''}`}  // Add 'completed' class if task is completed
          onClick={() => onToggleComplete(task.id)}  // Click task title to toggle completion state
        >
          {task.title} {/* Display task title */}
        </span>

        <span className={`task-description ${task.completed ? 'completed' : ''}`} >
          {task.description} {/* Display task description */}
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
    </div>
  );
};

export default TaskItem;
