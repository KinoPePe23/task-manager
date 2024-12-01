import React, { useState, useEffect } from 'react';
import { db, ref, set, get, auth, logoutUser } from './firebase'; // Import Firebase services
import TaskItem from './components/TaskItem';
import TaskForm from './components/TaskForm';
import Login from './components/Login';  // Import Login component
import Register from './components/Register';  // Import Register component
import './css/App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [showCompleted, setShowCompleted] = useState(true); // Track completed tasks visibility
  const [user, setUser] = useState(null); // User state to store current logged-in user
  const [isLogin, setIsLogin] = useState(true); // State to toggle between Login and Register views

  // Check if the user is authenticated when the app loads or when the auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set user after successful login
      } else {
        setUser(null); // Clear user state if logged out
      }
    });

    return () => unsubscribe(); // Clean up the subscription when the component is unmounted
  }, []);

  // Fetch tasks for the logged-in user
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return; // If no user is logged in, return early

      const taskRef = ref(db, `tasks/${user.uid}`); // Fetch tasks from Firebase under user.uid
      const snapshot = await get(taskRef);
      if (snapshot.exists()) {
        const tasksData = [];
        snapshot.forEach((childSnapshot) => {
          const task = childSnapshot.val();
          tasksData.push({ id: childSnapshot.key, ...task });
        });
        tasksData.sort((a, b) => {
          const dateA = a.dueDate || a.createdAt;
          const dateB = b.dueDate || b.createdAt;
          return new Date(dateA) - new Date(dateB);  // Ascending order
        });
        setTasks(tasksData);
      } else {
        console.log('No data available');
        setTasks([]); // Clear tasks for the current user if no tasks exist
      }
    };

    fetchTasks();
  }, [user]); // Only re-run when the user state changes

  // Logout user and redirect to login page
  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null); // Clear user state upon logout
      setIsLogin(true); // Ensure we show login page after logout
      setTasks([]); // Clear tasks upon logout
    } catch (error) {
      console.error('Logout failed: ', error.message);
    }
  };

  // Add a new task
  const addTask = async (task) => {
    try {
      if (!user) return; // Ensure the user is logged in

      const taskRef = ref(db, `tasks/${user.uid}/${Date.now()}`); // Store task under tasks/{user.uid}
      await set(taskRef, task);
      setTasks((prevTasks) => {
        const newTasks = [task, ...prevTasks];
        newTasks.sort((a, b) => {
          const dateA = a.dueDate || a.createdAt;
          const dateB = b.dueDate || b.createdAt;
          return new Date(dateA) - new Date(dateB); // Sorting by date
        });
        return newTasks;
      });
    } catch (e) {
      console.error('Error adding task: ', e);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      if (!user) return; // Ensure the user is logged in

      const taskRef = ref(db, `tasks/${user.uid}/${id}`); // Ensure task is deleted under the user's uid
      await set(taskRef, null);  // Remove task from the database
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));  // Update state
    } catch (e) {
      console.error('Error deleting task: ', e);
    }
  };

  // Toggle task completion status
  const toggleTaskCompletion = async (id) => {
    const task = tasks.find((task) => task.id === id);
    if (task) {
      const updatedTask = { ...task, completed: !task.completed, updatedAt: Date.now() };
      const taskRef = ref(db, `tasks/${user.uid}/${id}`); // Ensure task is updated under the user's uid
      await set(taskRef, updatedTask);
      setTasks((prevTasks) => {
        const updatedTasks = prevTasks.map((t) => (t.id === id ? updatedTask : t));
        updatedTasks.sort((a, b) => {
          const dateA = a.dueDate || a.createdAt;
          const dateB = b.dueDate || b.createdAt;
          return new Date(dateA) - new Date(dateB);
        });
        return updatedTasks;
      });
    }
  };

  // Handle successful login or registration
  const handleAuthSuccess = () => {
    setUser(auth.currentUser); // Set user after successful login/registration
  };

  // Toggle show/hide completed tasks
  const handleToggleCompleted = () => {
    setShowCompleted(!showCompleted);  // Toggle visibility of completed tasks
  };

  return (
    <div className="app">
      {user ? (
        <>
          <h1>Task Manager</h1>
          <div className="user-info">
            <span>Welcome, {user.email}</span>
            <button className="logout-icon" onClick={handleLogout}>
              <span className="material-icons">logout</span> {/* Material icon */}
            </button>
          </div>
          <TaskForm onSave={addTask} />
          <div className="task-container">
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
            <div className="task-section completed-tasks">
              <h2>
                Completed
                <button onClick={handleToggleCompleted} className="toggle-completed-btn">
                  {showCompleted ? '▼' : '►'} {/* Arrow for expanding/collapsing */}
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
        </>
      ) : isLogin ? (
        <Login onAuthSuccess={handleAuthSuccess} setIsLogin={setIsLogin} />
      ) : (
        <Register onAuthSuccess={handleAuthSuccess} setIsLogin={setIsLogin} />
      )}
    </div>
  );
};

export default App;
