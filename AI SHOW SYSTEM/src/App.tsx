import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Gallery from './pages/Gallery';
import Schedule from './pages/Schedule';
import Vote from './pages/Vote';
import LiveVoting from './pages/voting/LiveVoting';
import Validate from './pages/Validate';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/login" element={<Login />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/vote" element={<Vote />} />
          <Route path="/live-voting" element={<LiveVoting />} />
          <Route path="/validate" element={<Validate />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
