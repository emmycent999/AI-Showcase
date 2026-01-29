import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Participant from './pages/Participant';
import Organiser from './pages/Organiser';
import Alumni from './pages/Alumni';
import Validate from './pages/Validate';
import Vote from './pages/Vote';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/participant" element={<Participant />} />
        <Route path="/organiser" element={<Organiser />} />
        <Route path="/alumni" element={<Alumni />} />
        <Route path="/validate" element={<Validate />} />
        <Route path="/vote" element={<Vote />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
