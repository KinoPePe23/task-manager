// src/TaskForm.js
import React, { useState } from 'react';

const TaskForm = ({ onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      title,
      description,
      completed: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    onSave(newTask);  // Call the onSave method passed from the parent component
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Save Task</button>
    </form>
  );
};

export default TaskForm;
