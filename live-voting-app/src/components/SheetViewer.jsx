import { useState, useEffect } from 'react';
import { RefreshCw, Download, ExternalLink } from 'lucide-react';
import SheetVoteService from '../utils/sheetVoteService';

const SheetViewer = () => {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState('');

  const loadVotes = async () => {
    setLoading(true);
    try {
      const data = await SheetVoteService.getAllVotes();
      setVotes(data);
      setLastUpdate(new Date().toLocaleTimeString());
      console.log('📊 Loaded votes:', data);
    } catch (error) {
      console.error('Failed to load votes:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadVotes();
    // Auto-refresh every 10 seconds
    const interval = setInterval(loadVotes, 10000);
    return () => clearInterval(interval);
  }, []);

  const totalVotes = votes.reduce((sum, item) => sum + (item.votes || 0), 0);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>📊 Live Vote Count</h3>
        <div style={styles.controls}>
          <button 
            onClick={loadVotes} 
            disabled={loading}
            style={styles.button}
          >
            <RefreshCw size={16} /> {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button 
            onClick={SheetVoteService.exportToCSV}
            style={{...styles.button, background: '#10b981'}}
          >
            <Download size={16} /> Export CSV
          </button>
          <span style={styles.timestamp}>
            Last: {lastUpdate || 'Never'}
          </span>
        </div>
      </div>

      <div style={styles.totalBox}>
        <strong>Total Votes:</strong> {totalVotes}
      </div>

      {votes.length === 0 ? (
        <div style={styles.empty}>
          No votes recorded yet. Votes will appear here automatically.
        </div>
      ) : (
        <div style={styles.table}>
          {votes.map((item, index) => {
            const percentage = totalVotes > 0 ? ((item.votes / totalVotes) * 100).toFixed(1) : 0;
            return (
              <div key={index} style={styles.row}>
                <div style={styles.rank}>
                  {index === 0 ? '🥇' : 
                   index === 1 ? '🥈' : 
                   index === 2 ? '🥉' : `#${index + 1}`}
                </div>
                <div style={styles.groupInfo}>
                  <div style={styles.groupName}>{item.group}</div>
                  <div style={styles.source}>
                    {item.source === 'sheet' ? '📊 Google Sheets' : 
                     item.source === 'local' ? '💾 Local Only' : 
                     '🌐 Mixed'}
                  </div>
                </div>
                <div style={styles.voteInfo}>
                  <div style={styles.voteCount}>{item.votes} votes</div>
                  <div style={styles.percentage}>{percentage}%</div>
                </div>
                <div style={styles.progressBar}>
                  <div 
                    style={{
                      ...styles.progressFill,
                      width: `${percentage}%`,
                      background: index === 0 ? '#10b981' : 
                                index === 1 ? '#3b82f6' : 
                                index === 2 ? '#8b5cf6' : '#64748b'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    background: 'rgba(30, 41, 59, 0.5)',
    borderRadius: '12px',
    padding: '20px',
    margin: '20px 0',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '10px',
  },
  title: {
    margin: 0,
    color: 'white',
    fontSize: '18px',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  timestamp: {
    color: '#94a3b8',
    fontSize: '14px',
  },
  totalBox: {
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '20px',
    textAlign: 'center',
    fontSize: '18px',
    color: '#10b981',
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    color: '#64748b',
    fontSize: '16px',
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '50px 2fr 1fr',
    gap: '15px',
    padding: '15px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
    alignItems: 'center',
    position: 'relative',
  },
  rank: {
    fontSize: '20px',
    textAlign: 'center',
  },
  groupInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  groupName: {
    fontWeight: '600',
    color: 'white',
    fontSize: '16px',
  },
  source: {
    fontSize: '12px',
    color: '#94a3b8',
  },
  voteInfo: {
    textAlign: 'right',
  },
  voteCount: {
    color: '#10b981',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  percentage: {
    color: '#94a3b8',
    fontSize: '14px',
  },
  progressBar: {
    gridColumn: '1 / -1',
    height: '6px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '3px',
    overflow: 'hidden',
    marginTop: '10px',
  },
  progressFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.5s ease',
  },
};

export default SheetViewer;