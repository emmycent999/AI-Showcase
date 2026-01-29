import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Download, 
  RefreshCw, 
  Award, 
  Shield,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useScreenSize } from '../hooks/useScreenSize';
import './AdminDashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const screen = useScreenSize();
  const [candidates, setCandidates] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [showLeaderboard, setShowLeaderboard] = useState(!screen.isMobile);

  useEffect(() => {
    loadVotes();
    
    const interval = setInterval(() => {
      loadVotes();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const loadVotes = () => {
    const savedVotes = localStorage.getItem('votelive_votes');
    if (savedVotes) {
      const parsed = JSON.parse(savedVotes);
      setCandidates(parsed);
      const total = parsed.reduce((sum, c) => sum + c.votes, 0);
      setTotalVotes(total);
      setLastUpdate(new Date());
    }
  };

  const resetAllVotes = () => {
    if (!window.confirm('Reset ALL votes to zero?')) return;
    
    const resetCandidates = candidates.map(c => ({ ...c, votes: 0 }));
    localStorage.setItem('votelive_votes', JSON.stringify(resetCandidates));
    localStorage.removeItem('votelive_voter');
    loadVotes();
  };

  const exportData = () => {
    const data = {
      event: 'Tech Innovation Showcase 2024',
      timestamp: new Date().toISOString(),
      totalVotes,
      candidates: candidates.sort((a, b) => b.votes - a.votes),
      summary: candidates.map(c => ({
        name: c.name,
        votes: c.votes,
        percentage: totalVotes > 0 ? ((c.votes / totalVotes) * 100).toFixed(2) + '%' : '0%'
      }))
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voting-results-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);
  const leadingCandidate = sortedCandidates[0];

  // Chart data
  const chartData = {
  labels: candidates.map(c => screen.isMobile ? c.name.split(' ')[0] : c.name),
    datasets: [
      {
        label: 'Votes',
        data: candidates.map(c => c.votes),
        backgroundColor: candidates.map(c => c.color),
        borderColor: candidates.map(c => c.color),
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: !screen.isMobile,
        text: 'Live Vote Distribution',
        color: '#ffffff',
        font: {
          size: screen.isMobile ? 14 : 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#94a3b8',
          font: {
            size: screen.isMobile ? 10 : 12,
          },
          maxRotation: screen.isMobile ? 45 : 0,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#94a3b8',
          font: {
            size: screen.isMobile ? 10 : 12,
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
      },
    },
  };

  return (
    <div className={`admin-dashboard ${screen.isMobile ? 'mobile' : ''}`}>
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <BarChart3 size={screen.isMobile ? 22 : 28} />
            <div>
              <h1 className={screen.isMobile ? 'mobile' : ''}>Live Voting Dashboard</h1>
              <p className="subtitle">Real-time monitoring</p>
            </div>
          </div>
          
          <div className={`header-actions ${screen.isMobile ? 'mobile' : ''}`}>
            <button className="action-btn" onClick={loadVotes}>
              <RefreshCw size={screen.isMobile ? 16 : 18} />
              {!screen.isMobile && 'Refresh'}
            </button>
            <button className="action-btn export" onClick={exportData}>
              <Download size={screen.isMobile ? 16 : 18} />
              {!screen.isMobile && 'Export'}
            </button>
            <button className="action-btn danger" onClick={resetAllVotes}>
              <Shield size={screen.isMobile ? 16 : 18} />
              {!screen.isMobile && 'Reset Votes'}
            </button>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className={`stats-overview ${screen.isMobile ? 'mobile' : ''}`}>
        <div className="stat-card">
          <div className="stat-icon total">
            <Users />
          </div>
          <div className="stat-content">
            <span className="stat-value">{totalVotes}</span>
            <span className="stat-label">Total Votes</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon leader">
            <Award />
          </div>
          <div className="stat-content">
            <span className="stat-value">{leadingCandidate?.name || 'None'}</span>
            <span className="stat-label">Current Leader</span>
          </div>
        </div>

        {!screen.isMobile && (
          <>
            <div className="stat-card">
              <div className="stat-icon time">
                <Clock />
              </div>
              <div className="stat-content">
                <span className="stat-value">02:15:30</span>
                <span className="stat-label">Time Remaining</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon trend">
                <TrendingUp />
              </div>
              <div className="stat-content">
                <span className="stat-value">
                  {sortedCandidates.length > 1 
                    ? `${sortedCandidates[0]?.votes - sortedCandidates[1]?.votes} votes` 
                    : 'N/A'}
                </span>
                <span className="stat-label">Lead Margin</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Chart Section */}
        <div className="chart-section">
          <div className="section-header">
            <h2><BarChart3 size={screen.isMobile ? 18 : 20} /> Live Results</h2>
            <span className="update-time">
              {screen.isMobile ? 
                lastUpdate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) :
                `Updated: ${lastUpdate.toLocaleTimeString()}`
              }
            </span>
          </div>
          <div className="chart-container">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="leaderboard-section">
          <div className="section-header">
            <h2><Award size={screen.isMobile ? 18 : 20} /> Leaderboard</h2>
            {screen.isMobile && (
              <button 
                className="toggle-btn"
                onClick={() => setShowLeaderboard(!showLeaderboard)}
              >
                {showLeaderboard ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            )}
          </div>
          
          {(!screen.isMobile || showLeaderboard) && (
            <div className="leaderboard">
              {sortedCandidates.map((candidate, index) => (
                <div key={candidate.id} className={`leaderboard-item ${index < 3 ? 'podium' : ''}`}>
                  <div className="rank">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </div>
                  <div className="candidate-info">
                    <span className="candidate-name">
                      {screen.isMobile && candidate.name.length > 20 
                        ? candidate.name.substring(0, 20) + '...' 
                        : candidate.name}
                    </span>
                    <span className="candidate-category">{candidate.category}</span>
                  </div>
                  <div className="vote-stats">
                    <span className="vote-count">{candidate.votes} votes</span>
                    <span className="vote-percentage">
                      {totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Footer */}
      {screen.isMobile && (
        <footer className="mobile-footer">
          <div className="mobile-stats">
            <div className="mobile-stat">
              <Clock size={16} />
              <span>02:15:30</span>
            </div>
            <div className="mobile-stat">
              <TrendingUp size={16} />
              <span>
                {sortedCandidates.length > 1 
                  ? `${sortedCandidates[0]?.votes - sortedCandidates[1]?.votes} votes` 
                  : 'N/A'}
              </span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default AdminDashboard;