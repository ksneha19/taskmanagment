//App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/Home/HomePage'; // Replace with correct path
import UsersPage from './pages/Users/UsersPage'; // Replace with correct path
import TasksPage from './pages/Tasks/TasksPage'; // Replace with correct path

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/tasks" element={<TasksPage />} />
      </Routes>
    </Router>
  );
};

export default App;

