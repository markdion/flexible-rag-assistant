import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Chat from './components/Chat';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Chat />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
};

export default App;