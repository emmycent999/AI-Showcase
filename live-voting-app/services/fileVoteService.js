// services/fileVoteService.js
const API_URL = 'http://localhost:3001/api'; // Change to your server URL when deploying

const FileVoteService = {
  // Save a vote
  async recordVote(groupName) {
    try {
      const response = await fetch(`${API_URL}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupName })
      });
      
      const data = await response.json();
      
      // Backup locally in case server fails
      this.saveLocalBackup(groupName);
      
      return data;
    } catch (error) {
      console.log('Server offline, saving locally');
      return this.saveLocalBackup(groupName);
    }
  },

  // Get current counts
  async getVotes() {
    try {
      const response = await fetch(`${API_URL}/votes`);
      const data = await response.json();
      
      if (data.success) {
        // Merge with local backups
        return this.mergeWithLocal(data.votes);
      }
      
      return this.getLocalVotes();
    } catch (error) {
      console.log('Using local votes only');
      return this.getLocalVotes();
    }
  },

  // Local backup
  saveLocalBackup(groupName) {
    const key = 'local_votes';
    const votes = JSON.parse(localStorage.getItem(key) || '{}');
    votes[groupName] = (votes[groupName] || 0) + 1;
    localStorage.setItem(key, JSON.stringify(votes));
    
    // Mark as pending sync
    const pending = JSON.parse(localStorage.getItem('pending_votes') || '[]');
    pending.push({ groupName, timestamp: new Date().toISOString() });
    localStorage.setItem('pending_votes', JSON.stringify(pending.slice(-100)));
    
    return { success: true, votes };
  },

  // Get local votes
  getLocalVotes() {
    const votes = JSON.parse(localStorage.getItem('local_votes') || '{}');
    return { success: true, votes };
  },

  // Merge server + local votes
  mergeWithLocal(serverVotes) {
    const localVotes = JSON.parse(localStorage.getItem('local_votes') || '{}');
    
    const merged = { ...serverVotes };
    Object.keys(localVotes).forEach(group => {
      merged[group] = (merged[group] || 0) + localVotes[group];
    });
    
    return { success: true, votes: merged };
  },

  // Reset all votes (admin)
  async resetVotes() {
    try {
      const response = await fetch(`${API_URL}/reset`, { method: 'POST' });
      const data = await response.json();
      
      // Clear local backups too
      localStorage.removeItem('local_votes');
      localStorage.removeItem('pending_votes');
      
      return data;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Export as CSV
  exportVotes(votes) {
    const entries = Object.entries(votes);
    let csv = 'Group,Votes\n';
    entries.forEach(([group, count]) => {
      csv += `"${group}",${count}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `votes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  }
};

export default FileVoteService;