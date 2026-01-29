// In VoterView.jsx, replace the imports and useEffect
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VotingCard from './VotingCard';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Users, 
  Target,
  Shield,
  X,
  Award,
  Vote,
  RefreshCw
} from 'lucide-react';
import { initializeData } from '../utils/dataManager'; // NEW IMPORT
import './VoterView.css';

const VoterView = () => {
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showVotePrompt, setShowVotePrompt] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [needsRefresh, setNeedsRefresh] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load votes with version control
  useEffect(() => {
    // Initialize data with version check
    const loadedCandidates = initializeData();
    setCandidates(loadedCandidates);
    
    const total = loadedCandidates.reduce((sum, c) => sum + c.votes, 0);
    setTotalVotes(total);
    
    // Check if voted
    const voterStatus = localStorage.getItem('votelive_voter');
    if (voterStatus) setHasVoted(true);
    
    // Check if data was just updated
    const savedVersion = localStorage.getItem('data_version');
    const currentVersion = '2.0'; // Must match dataManager.js
    if (savedVersion !== currentVersion) {
      setNeedsRefresh(true);
    }
  }, []);

  // Rest of your VoterView component remains the same...
  // [Keep all your existing handleSelectCandidate, handleSubmitVote, etc.]
  const handleSelectCandidate = (candidate) => {
    if (hasVoted) return;
    setSelectedCandidate(candidate);
    setShowVotePrompt(true);
  };

  const handleSubmitVote = () => {
    if (!selectedCandidate) return;

    const updatedCandidates = candidates.map(candidate => 
      candidate.id === selectedCandidate.id 
        ? { ...candidate, votes: candidate.votes + 1 }
        : candidate
    );
    
    localStorage.setItem('votelive_votes', JSON.stringify(updatedCandidates));
    localStorage.setItem('votelive_voter', 'true');
    
    setCandidates(updatedCandidates);
    setHasVoted(true);
    setShowSuccess(true);
    setShowVotePrompt(false);
    setTotalVotes(prev => prev + 1);
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
            <Award size={isMobile ? 64 : 80} />
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
            
            <div className="success-footer">
              <p>Your vote has been securely recorded.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="voter-app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="brand">
            <Vote className="logo-icon" />
            <div className="brand-text">
              <h1>Tech Innovation Showcase 2026</h1>
              <p className="event-subtitle">Live Audience Voting</p>
            </div>
          </div>
          
          <div className="live-stats">
            <div className="stat">
              <Users size={isMobile ? 18 : 20} />
              <div>
                <span className="stat-value">{totalVotes}</span>
                <span className="stat-label">Total Votes</span>
              </div>
            </div>
            <div className="stat">
              <Clock size={isMobile ? 18 : 20} />
              <div>
                <span className="stat-value">02:15</span>
                <span className="stat-label">Time Left</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Vote Prompt Modal */}
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
              initial={{ y: isMobile ? '100%' : '50px', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: isMobile ? '100%' : '50px', opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: isMobile ? '100%' : '500px' }}
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
                <div className="selected-project-card" style={{ borderColor: selectedCandidate.color }}>
                  <div className="project-color-accent" style={{ backgroundColor: selectedCandidate.color }} />
                  <div className="project-details">
                    <h3>{selectedCandidate.name}</h3>
                    <span className="project-category">{selectedCandidate.category}</span>
                    <p className="project-description">{selectedCandidate.description}</p>
                    <div className="project-stats">
                      <div className="stat-badge">
                        <Users size={16} />
                        <span>{selectedCandidate.votes} votes</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="confirmation-warning">
                  <AlertCircle size={18} />
                  <p>This is your only vote. The decision cannot be changed.</p>
                </div>
              </div>
              
              <div className="modal-actions">
                <button 
                  className="secondary-button"
                  onClick={handleCancelVote}
                >
                  Cancel
                </button>
                <button 
                  className="primary-button"
                  onClick={handleSubmitVote}
                  style={{ backgroundColor: selectedCandidate.color }}
                >
                  <CheckCircle size={18} />
                  Confirm Vote
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-intro">
          <h2>Select Your Favorite Innovation</h2>
          <p className="intro-text">Tap any project card to vote. Each device can vote once.</p>
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
        
        {hasVoted ? (
          <div className="status-banner voted">
            <CheckCircle size={20} />
            <span>You have already submitted your vote</span>
          </div>
        ) : (
          <div className="status-banner instructions">
            <Target size={18} />
            <span>Select a project → Confirm → Vote submitted</span>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="security-notice">
            <Shield size={16} />
            <span>Secure Voting System • Encrypted Results</span>
          </div>
          <div className="event-info">
            <span>Tech Innovation Showcase 2024 • Powered by Votelive</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VoterView;