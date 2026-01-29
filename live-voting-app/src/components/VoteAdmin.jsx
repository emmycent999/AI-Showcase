import { useState, useEffect } from 'react';
import { RefreshCw, Download, Trash2, Users, Award, TrendingUp, Database } from 'lucide-react';
import VoteService from '../services/voteService';

const VoteAdmin = () => {
  const [votes, setVotes] = useState({});
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState('');
  const [serverOnline, setServerOnline] = useState(true);

  const loadVotes = async () => {
    setLoading(true);
    try {
      const result = await VoteService.getVotes();
      
      if (result.success) {
        setVotes(result.votes);
        setServerOnline(!result.local);
        setLastUpdate(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error('Failed to load votes:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadVotes();
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(loadVotes, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset ALL votes to zero?')) return;
    
    const result = await VoteService.resetVotes();
    if (result.success) {
      setVotes({});
      alert('✅ All votes reset!');
      loadVotes();
    } else {
      alert('❌ Failed to reset votes');
    }
  };

  const handleSync = async () => {
    const result = await VoteService.syncPendingVotes();
    if (result.success) {
      alert(`✅ Synced ${result.synced} pending votes`);
      loadVotes();
    }
  };

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
  const sortedGroups = Object.entries(votes)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count], index) => ({ 
      rank: index + 1, 
      name, 
      count,
      percentage: totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(1) : 0
    }));

  const leadingMargin = sortedGroups.length > 1 
    ? sortedGroups[0].count - sortedGroups[1].count 
    : 0;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleSection}>
          <Database size={24} />
          <h3 style={styles.title}>Live Vote Dashboard</h3>
          <div style={styles.status}>
            <div style={{
              ...styles.statusDot,
              background: serverOnline ? '#10b981' : '#f59e0b'
            }} />
            <span>{serverOnline ? 'Server Online' : 'Local Mode'}</span>
          </div>
        </div>
        
        <div style={styles.controls}>
          <button 
            onClick={loadVotes} 
            disabled={loading}
            style={styles.button}
          >
            <RefreshCw size={16} /> {loading ? 'Loading...' : 'Refresh'}
          </button>
          
          {!serverOnline && (
            <button 
              onClick={handleSync}
              style={{...styles.button, background: '#8b5cf6'}}
            >
              🔄 Sync Local Votes
            </button>
          )}
          
          <button 
            onClick={() => VoteService.exportVotes(votes)}
            style={{...styles.button, background: '#10b981'}}
          >
            <Download size={16} /> Export CSV
          </button>
          
          <button 
            onClick={handleReset}
            style={{...styles.button, background: '#ef4444'}}
          >
            <Trash2 size={16} /> Reset All
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <Users size={24} />
          </div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>{totalVotes}</div>
            <div style={styles.statLabel}>Total Votes</div>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: 'rgba(245, 158, 11, 0.1)'}}>
            <Award size={24} />
          </div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>
              {sortedGroups[0]?.name || 'None'}
            </div>
            <div style={styles.statLabel}>Current Leader</div>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: 'rgba(16, 185, 129, 0.1)'}}>
            <TrendingUp size={24} />
          </div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>{leadingMargin}</div>
            <div style={styles.statLabel}>Lead Margin</div>
          </div>
        </div>
        
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: 'rgba(139, 92, 246, 0.1)'}}>
            <Database size={24} />
          </div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>{sortedGroups.length}</div>
            <div style={styles.statLabel}>Groups</div>
          </div>
        </div>
      </div>

      {/* Last Update */}
      {lastUpdate && (
        <div style={styles.updateTime}>
          Last updated: {lastUpdate}
        </div>
      )}

      {/* Vote Table */}
      <div style={styles.tableContainer}>
        <h4 style={styles.tableTitle}>Live Vote Count</h4>
        
        {sortedGroups.length === 0 ? (
          <div style={styles.empty}>
            No votes recorded yet. Votes will appear here automatically.
          </div>
        ) : (
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <div style={styles.headerCell}></div>
              <div style={styles.headerCell}>Group</div>
              <div style={styles.headerCell}>Votes</div>
              <div style={styles.headerCell}>%</div>
              <div style={styles.headerCell}>Progress</div>
            </div>
            
            {sortedGroups.map((group, index) => (
              <div key={group.name} style={styles.tableRow}>
                <div style={styles.rankCell}>
                  {index === 0 ? '🥇' : 
                   index === 1 ? '🥈' : 
                   index === 2 ? '🥉' : `#${group.rank}`}
                </div>
                
                <div style={styles.nameCell}>
                  <div style={styles.groupName}>{group.name}</div>
                  <div style={styles.groupInfo}>
                    {group.count} vote{group.count !== 1 ? 's' : ''}
                  </div>
                </div>
                
                <div style={styles.votesCell}>
                  <span style={styles.voteCount}>{group.count}</span>
                </div>
                
                <div style={styles.percentageCell}>
                  {group.percentage}%
                </div>
                
                <div style={styles.progressCell}>
                  <div style={styles.progressBar}>
                    <div 
                      style={{
                        ...styles.progressFill,
                        width: `${group.percentage}%`,
                        background: index === 0 ? '#10b981' : 
                                  index === 1 ? '#3b82f6' : 
                                  index === 2 ? '#8b5cf6' : '#64748b'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: 'rgba(30, 41, 59, 0.9)',
    borderRadius: '16px',
    padding: '24px',
    margin: '20px 0',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  titleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  title: {
    margin: 0,
    color: 'white',
    fontSize: '20px',
    fontWeight: '600',
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 12px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '20px',
    fontSize: '12px',
    color: '#94a3b8',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  controls: {
    display: 'flex',
    gap: '8px',
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
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
  },
  statCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(59, 130, 246, 0.1)',
    color: '#3b82f6',
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    color: 'white',
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '1',
    marginBottom: '4px',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  updateTime: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: '14px',
    marginBottom: '16px',
  },
  tableContainer: {
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    padding: '20px',
  },
  tableTitle: {
    color: 'white',
    fontSize: '16px',
    margin: '0 0 16px 0',
    fontWeight: '600',
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
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '60px 2fr 100px 80px 2fr',
    gap: '16px',
    padding: '12px 16px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    marginBottom: '8px',
  },
  headerCell: {
    color: '#94a3b8',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '600',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '60px 2fr 100px 80px 2fr',
    gap: '16px',
    padding: '16px',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  rankCell: {
    fontSize: '18px',
    textAlign: 'center',
    fontWeight: '600',
  },
  nameCell: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  groupName: {
    color: 'white',
    fontSize: '16px',
    fontWeight: '500',
  },
  groupInfo: {
    color: '#64748b',
    fontSize: '12px',
  },
  votesCell: {
    textAlign: 'right',
  },
  voteCount: {
    color: '#10b981',
    fontSize: '20px',
    fontWeight: '700',
  },
  percentageCell: {
    color: '#94a3b8',
    fontSize: '16px',
    fontWeight: '500',
    textAlign: 'center',
  },
  progressCell: {
    display: 'flex',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: '8px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.5s ease',
  },
};

export default VoteAdmin;