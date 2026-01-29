// src/services/voteService.js
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001/api'
  : '/api'; // When deployed, use relative path

const VoteService = {
  // Save a vote
  async saveVote(groupName) {
    try {
      console.log('📤 Saving vote:', groupName);
      
      const response = await fetch(`${API_URL}/vote`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ group: groupName })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Vote saved to server');
        return data;
      } else {
        throw new Error(data.error || 'Server error');
      }
      
    } catch (error) {
      console.warn('⚠️ Server offline, saving locally:', error.message);
      return this.saveLocal(groupName);
    }
  },

  // Get all votes
  async getVotes() {
    try {
      console.log('📥 Fetching votes...');
      const response = await fetch(`${API_URL}/votes`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        const merged = this.mergeWithLocal(data.votes);
        return { success: true, votes: merged };
      }
      
      throw new Error(data.error || 'Failed to get votes');
      
    } catch (error) {
      console.warn('⚠️ Using local votes only:', error.message);
      return this.getLocalVotes();
    }
  },

  // Reset all votes
  async resetVotes() {
    try {
      const response = await fetch(`${API_URL}/reset`, {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.removeItem('local_votes');
        localStorage.removeItem('pending_votes');
        return data;
      }
      
      throw new Error(data.error || 'Reset failed');
      
    } catch (error) {
      console.error('Reset error:', error);
      return { success: false, error: error.message };
    }
  },

  // Save vote locally
  saveLocal(groupName) {
    console.log('💾 Saving locally:', groupName);
    
    const key = 'local_votes';
    const votes = JSON.parse(localStorage.getItem(key) || '{}');
    const current = votes[groupName] || 0;
    votes[groupName] = current + 1;
    
    localStorage.setItem(key, JSON.stringify(votes));
    
    // Track pending sync
    const pending = JSON.parse(localStorage.getItem('pending_votes') || '[]');
    pending.push({ 
      group: groupName, 
      time: new Date().toISOString() 
    });
    localStorage.setItem('pending_votes', JSON.stringify(pending.slice(-50))); // Keep last 50
    
    console.log('Local votes:', votes);
    return { 
      success: true, 
      votes, 
      local: true,
      message: 'Saved locally (server offline)'
    };
  },

  // Get local votes
  getLocalVotes() {
    const votes = JSON.parse(localStorage.getItem('local_votes') || '{}');
    console.log('📚 Local votes:', votes);
    return { 
      success: true, 
      votes, 
      local: true 
    };
  },

  // Merge server + local votes
  mergeWithLocal(serverVotes) {
    const localVotes = JSON.parse(localStorage.getItem('local_votes') || '{}');
    const merged = { ...serverVotes };
    
    Object.entries(localVotes).forEach(([group, count]) => {
      merged[group] = (merged[group] || 0) + count;
    });
    
    console.log('🔄 Merged votes:', merged);
    return merged;
  },

  // Export votes to CSV
  exportVotes(votes) {
    if (!votes || Object.keys(votes).length === 0) {
      alert('No votes to export');
      return;
    }
    
    // Sort by votes (highest first)
    const sorted = Object.entries(votes)
      .sort((a, b) => b[1] - a[1]);
    
    let csv = 'Rank,Group,Votes\n';
    sorted.forEach(([group, count], index) => {
      csv += `${index + 1},"${group}",${count}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `votes-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    console.log('📤 Exported CSV');
  },

  // Sync pending votes (for admin)
  async syncPendingVotes() {
    const pending = JSON.parse(localStorage.getItem('pending_votes') || '[]');
    const localVotes = JSON.parse(localStorage.getItem('local_votes') || '{}');
    
    if (pending.length === 0) {
      console.log('✅ No pending votes to sync');
      return { success: true, synced: 0 };
    }
    
    console.log('🔄 Syncing', pending.length, 'pending votes...');
    
    let synced = 0;
    for (const vote of pending) {
      try {
        await this.saveVote(vote.group);
        synced++;
      } catch (e) {
        console.warn('Failed to sync vote:', vote.group, e.message);
      }
    }
    
    // Clear local storage if all synced
    if (synced === pending.length) {
      localStorage.removeItem('local_votes');
      localStorage.removeItem('pending_votes');
      console.log('✅ All votes synced to server');
    }
    
    return { success: true, synced };
  }
};

export default VoteService;