// utils/dataManager.js

// Current version - increment this when you change the data
const DATA_VERSION = '2.0';

// Correct group data
const CORRECT_GROUPS = [
  { id: 1, name: "GreenGuard AI", category: "Environmental Tech", description: "Environmental Monitoring System using AI for pollution detection and analysis", color: "#10b981", votes: 0 },
  { id: 2, name: "NovaCare Health", category: "Healthcare Technology", description: "AI-Powered Diagnostic Assistant for early disease detection", color: "#ef4444", votes: 0 },
  { id: 3, name: "PathFinders Pro", category: "Accessibility Tech", description: "Navigation System for Visually Impaired with real-time obstacle detection", color: "#8b5cf6", votes: 0 },
  { id: 4, name: "Linguatech", category: "Language Technology", description: "Real-Time Multilingual Translation Platform with cultural context", color: "#3b82f6", votes: 0 },
  { id: 5, name: "EnergyMind", category: "Clean Energy", description: "Smart Grid Optimization System for efficient energy distribution", color: "#f59e0b", votes: 0 },
  { id: 6, name: "LexiAssist AI", category: "Education Technology", description: "Adaptive Language Learning Assistant with personalized curriculum", color: "#ec4899", votes: 0 },
  { id: 7, name: "Project Insight", category: "Social Equity", description: "Equity and Accessibility platform for inclusive community solutions", color: "#06b6d4", votes: 0 },
  { id: 8, name: "Pivota", category: "Fintech & Security", description: "Cybersecurity and financial technology solutions for digital transactions", color: "#6366f1", votes: 0 }
];

// Check and fix data on all devices
export const initializeData = () => {
  const savedVersion = localStorage.getItem('data_version');
  const savedVotes = localStorage.getItem('votelive_votes');
  
  console.log(`Device data version: ${savedVersion || 'none'}, Current version: ${DATA_VERSION}`);
  
  // If version is different or no data exists, reset to correct data
  if (savedVersion !== DATA_VERSION || !savedVotes) {
    console.log('Resetting to correct group names...');
    
    // Reset to correct groups but preserve votes if possible
    let newCandidates = [...CORRECT_GROUPS];
    
    if (savedVotes && savedVersion) {
      // Try to migrate votes from old data structure
      try {
        const oldCandidates = JSON.parse(savedVotes);
        
        newCandidates = newCandidates.map(newCandidate => {
          // Find if this candidate exists in old data (match by ID or name)
          const oldCandidate = oldCandidates.find(old => 
            old.id === newCandidate.id || 
            old.name.toLowerCase() === newCandidate.name.toLowerCase()
          );
          
          if (oldCandidate) {
            return { ...newCandidate, votes: oldCandidate.votes || 0 };
          }
          return newCandidate;
        });
      } catch (error) {
        console.error('Error migrating votes:', error);
      }
    }
    
    // Save corrected data
    localStorage.setItem('votelive_votes', JSON.stringify(newCandidates));
    localStorage.setItem('data_version', DATA_VERSION);
    
    console.log('Data updated to version', DATA_VERSION);
    return newCandidates;
  }
  
  // Data is already correct version
  try {
    return JSON.parse(savedVotes);
  } catch (error) {
    console.error('Error parsing saved votes:', error);
    return CORRECT_GROUPS;
  }
};

// Get current data
export const getCurrentData = () => {
  return initializeData();
};

// Reset all votes (admin function)
export const resetAllVotes = () => {
  const resetCandidates = CORRECT_GROUPS.map(candidate => ({ ...candidate, votes: 0 }));
  localStorage.setItem('votelive_votes', JSON.stringify(resetCandidates));
  localStorage.removeItem('votelive_voter');
  return resetCandidates;
};

// Force update all devices (for emergency fixes)
export const forceDataUpdate = () => {
  localStorage.setItem('data_version', 'OUTDATED'); // Force update on next load
  localStorage.removeItem('votelive_votes');
  console.log('Data update forced. Next load will get fresh data.');
};