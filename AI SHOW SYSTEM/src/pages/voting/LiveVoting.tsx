import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VotingCard from './components/VotingCard';
import { 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Target,
  Shield,
  X,
  Award,
  Vote as VoteIcon
} from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';
import './voting.css';

const LiveVoting = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showVotePrompt, setShowVotePrompt] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.teams);
        if (res.ok) {
          const data = await res.json();
          setCandidates(data.map((t: any) => ({
            id: t.id,
            name: t.name,
            category: t.category,
            description: t.description,
            color: t.color,
            votes: 0
          })));
        }
      } catch (error) {
        console.error('Failed to fetch teams');
      }
    };
    fetchTeams();
    
    const voterStatus = localStorage.getItem('hasVoted');
    if (voterStatus) setHasVoted(true);
  }, []);

  const handleSelectCandidate = (candidate: any) => {
    if (hasVoted) return;
    setSelectedCandidate(candidate);
    setShowVotePrompt(true);
  };

  const handleSubmitVote = async () => {
    if (!selectedCandidate || !email) return;

    try {
      const res = await fetch(API_ENDPOINTS.vote, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, team_name: selectedCandidate.name })
      });

      if (res.ok) {
        const updatedCandidates = candidates.map(c => 
          c.id === selectedCandidate.id ? { ...c, votes: c.votes + 1 } : c
        );
        
        setCandidates(updatedCandidates);
        localStorage.setItem('hasVoted', 'true');
        setHasVoted(true);
        setShowSuccess(true);
        setShowVotePrompt(false);
        setTotalVotes(prev => prev + 1);
      } else {
        const data = await res.json();
        alert(data.error || 'Vote failed');
      }
    } catch (error) {
      alert('Network error');
    }
  };

  const handleCancelVote = () => {
    setSelectedCandidate(null);
    setShowVotePrompt(false);
  };

  if (hasVoted && showSuccess) {
    return (
      <div className="success-container">
        <div className="success-card">
          <motion.div 
            className="success-icon-wrapper"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <Award size={80} />
          </motion.div>
          
          <div className="success-content">
            <h1>Vote Confirmed</h1>
            <p className="success-message">
              Thank you for voting in the Tech Innovation Showcase.
              Results will be announced shortly.
            </p>
            
            <div className="voted-project">
              <div className="color-indicator" style={{ backgroundColor: selectedCandidate?.color }} />
              <div className="project-info">
                <h3>{selectedCandidate?.name}</h3>
                <p>{selectedCandidate?.description}</p>
                <span className="timestamp">
                  {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="voter-app">
      <header className="app-header">
        <div className="header-content">
          <div className="brand">
            <VoteIcon className="logo-icon" size={32} />
            <div className="brand-text">
              <h1>Tech Innovation Showcase 2026</h1>
              <p className="event-subtitle">Live Audience Voting</p>
            </div>
          </div>
          
          <div className="live-stats">
            <div className="stat">
              <Users size={20} />
              <div>
                <span className="stat-value">{totalVotes}</span>
                <span className="stat-label">Total Votes</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {showVotePrompt && selectedCandidate && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancelVote}
          >
            <motion.div 
              className="vote-modal"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div className="modal-title">
                  <Target size={20} />
                  <h2>Confirm Your Vote</h2>
                </div>
                <button className="close-button" onClick={handleCancelVote}>
                  <X size={20} />
                </button>
              </div>
              
              <div className="modal-body">
                <div className="form-group">
                  <label>Your Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="email-input"
                  />
                </div>

                <div className="selected-project-card" style={{ borderColor: selectedCandidate.color }}>
                  <div className="project-color-accent" style={{ backgroundColor: selectedCandidate.color }} />
                  <div className="project-details">
                    <h3>{selectedCandidate.name}</h3>
                    <span className="project-category">{selectedCandidate.category}</span>
                    <p className="project-description">{selectedCandidate.description}</p>
                  </div>
                </div>
                
                <div className="confirmation-warning">
                  <AlertCircle size={18} />
                  <p>This is your only vote. The decision cannot be changed.</p>
                </div>
              </div>
              
              <div className="modal-actions">
                <button className="secondary-button" onClick={handleCancelVote}>
                  Cancel
                </button>
                <button 
                  className="primary-button"
                  onClick={handleSubmitVote}
                  style={{ backgroundColor: selectedCandidate.color }}
                  disabled={!email}
                >
                  <CheckCircle size={18} />
                  Confirm Vote
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="main-content">
        <div className="content-intro">
          <h2>Select Your Favorite Innovation</h2>
          <p className="intro-text">Tap any project card to vote. Each email can vote once.</p>
        </div>
        
        <div className="projects-container">
          <div className="projects-grid">
            {candidates.map((candidate) => (
              <div 
                key={candidate.id} 
                className="card-wrapper"
                onClick={() => handleSelectCandidate(candidate)}
              >
                <VotingCard
                  candidate={candidate}
                  isSelected={false}
                  onSelect={() => {}}
                  disabled={hasVoted}
                  totalVotes={totalVotes}
                />
              </div>
            ))}
          </div>
        </div>
        
        {hasVoted && (
          <div className="status-banner voted">
            <CheckCircle size={20} />
            <span>You have already submitted your vote</span>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="security-notice">
            <Shield size={16} />
            <span>Secure Voting System • Encrypted Results</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LiveVoting;
