import React, { useState, useEffect } from 'react';
import { db, ref, set, get } from './firebase';
import TaskItem from './components/TaskItem';
import TaskForm from './components/TaskForm';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [showCompleted, setShowCompleted] = useState(true); // Toggle visibility of completed tasks

  // Fetch tasks from Firebase on component mount
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
        tasksData.sort((a, b) => a.completed - b.completed); // Sort by completion status
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
      setTasks((prevTasks) => [task, ...prevTasks]);
    } catch (e) {
      console.error('Error adding task: ', e);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      const taskRef = ref(db, 'tasks/' + id);
      await set(taskRef, null);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (e) {
      console.error('Error deleting task: ', e);
    }
  };

  // Toggle completion status of a task
  const toggleTaskCompletion = async (id) => {
    const task = tasks.find((task) => task.id === id);
    if (task) {
      const updatedTask = { ...task, completed: !task.completed, updatedAt: Date.now() };
      const taskRef = ref(db, 'tasks/' + id);
      await set(taskRef, updatedTask);
      setTasks((prevTasks) => {
        const updatedTasks = prevTasks.map((t) => (t.id === id ? updatedTask : t));
        updatedTasks.sort((a, b) => a.completed - b.completed);
        return updatedTasks;
      });
    }
  };

  return (
    <div className="app">
      <h1>Task Manager</h1>
      <TaskForm onSave={addTask} />

      <div className="task-container">
        {/* Active tasks section */}
        <div className="task-section active-tasks">
          <h2>Tasks</h2>
          <div className="task-list">
            {tasks.filter((task) => !task.completed).map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={toggleTaskCompletion}
                onDelete={deleteTask}
              />
            ))}
          </div>
        </div>

        {/* Completed tasks section */}
        <div className="task-section completed-tasks">
          <h2>
            Completed
            <button
              className="toggle-completed-btn"
              onClick={() => setShowCompleted((prev) => !prev)}
            >
              <span className="material-icons">
                {showCompleted ? 'expand_less' : 'expand_more'}
              </span>
            </button>
          </h2>
          {showCompleted && (
            <div className="task-list">
              {tasks.filter((task) => task.completed).map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={toggleTaskCompletion}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
