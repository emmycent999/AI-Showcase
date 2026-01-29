import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import VoterView from './components/VoterView'
import AdminDashboard from './components/AdminDashboard'
import AuthGate from './components/AuthGate'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<VoterView />} />
          <Route path="/admin" element={
            <AuthGate>
              <AdminDashboard />
            </AuthGate>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App