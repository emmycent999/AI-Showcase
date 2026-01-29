import { motion } from 'framer-motion';
import { Check, Users } from 'lucide-react';

const VotingCard = ({ candidate, isSelected, onSelect, disabled, totalVotes }: any) => {
  const percentage = totalVotes > 0 ? (candidate.votes / totalVotes * 100) : 0;

  return (
    <motion.div 
      className={`voting-card ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
      whileHover={!disabled ? { scale: 1.02, y: -5 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={!disabled ? onSelect : undefined}
    >
      <div className="card-header" style={{ background: candidate.color }}>
        <span className="category-tag">{candidate.category}</span>
        {isSelected && (
          <motion.div 
            className="selection-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <Check size={16} />
          </motion.div>
        )}
      </div>
      
      <div className="card-content">
        <div className="candidate-info">
          <h3 className="candidate-name">{candidate.name}</h3>
          <p className="candidate-description">{candidate.description}</p>
        </div>
        
        <div className="vote-stats">
          <div className="vote-count">
            <Users size={16} />
            <span>{candidate.votes} votes</span>
          </div>
          <div className="vote-percentage">
            {percentage.toFixed(1)}%
          </div>
        </div>
        
        <div className="progress-container">
          <div 
            className="progress-bar"
            style={{ width: `${percentage}%`, background: candidate.color }}
          ></div>
        </div>
      </div>
    </motion.div>
  );
};

export default VotingCard;
