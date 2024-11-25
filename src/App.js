// src/App.js
import React, { useState, useEffect } from 'react';
import { db, ref, set, get } from './firebase';
import TaskItem from './components/TaskItem';
import TaskForm from './components/TaskForm';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);

  // Fetch task list
  useEffect(() => {
    const fetchTasks = async () => {
      const taskRef = ref(db, 'tasks');
      const snapshot = await get(taskRef);
      if (snapshot.exists()) {
        const tasksData = [];
        snapshot.forEach((childSnapshot) => {
          const task = childSnapshot.val();
          tasksData.push({ id: childSnapshot.key, ...task });
        });

        // Sort tasks based on completion status, with incomplete tasks first
        tasksData.sort((a, b) => a.completed - b.completed);
        setTasks(tasksData);
      } else {
        console.log('No data available');
      }
    };
    fetchTasks();
  }, []);

  // Add a new task
  const addTask = async (task) => {
    try {
      const taskRef = ref(db, 'tasks/' + Date.now());
      await set(taskRef, task);

      // New tasks should appear at the top of the list
      setTasks((prevTasks) => [task, ...prevTasks]);
    } catch (e) {
      console.error('Error adding task: ', e);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      const taskRef = ref(db, 'tasks/' + id);
      await set(taskRef, null);  // Delete the task from Firebase
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));  // Update the local task list
    } catch (e) {
      console.error('Error deleting task: ', e);
    }
  };

  // Toggle task completion status
  const toggleTaskCompletion = async (id) => {
    const task = tasks.find((task) => task.id === id);
    if (task) {
      const updatedTask = { ...task, completed: !task.completed, updatedAt: Date.now() };
      const taskRef = ref(db, 'tasks/' + id);
      await set(taskRef, updatedTask); // Update the task in Firebase

      // Update the local task list and sort
      setTasks((prevTasks) => {
        const updatedTasks = prevTasks.map((t) => (t.id === id ? updatedTask : t));
        updatedTasks.sort((a, b) => a.completed - b.completed); // Sort tasks after each update
        return updatedTasks;
      });
    }
  };

  return (
    <div className="app">
      <h1>Task Manager</h1>
      <TaskForm onSave={addTask} />
      <div className="task-list">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={toggleTaskCompletion}
            onDelete={deleteTask}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
