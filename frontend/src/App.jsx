import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import FileSystem from './pages/FileSystem';
import Settings from './pages/Settings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/fs" element={<FileSystem />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default App;
