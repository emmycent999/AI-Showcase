// utils/votingData.js
export const votingData = {
  event: "Tech Innovation Showcase 2024",
  venue: "Tech Center Auditorium",
  totalVotes: 0,
  candidates: [
    {
      id: 1,
      name: "GreenGuard AI",
      category: "Environmental Tech",
      description: "Environmental Monitoring System using AI for pollution detection and analysis",
      color: "#10b981", // Green
      votes: 0,
      teamMembers: ["Environmental Science", "AI Engineering", "Data Analytics"]
    },
    {
      id: 2,
      name: "NovaCare Health",
      category: "Healthcare Technology",
      description: "AI-Powered Diagnostic Assistant for early disease detection",
      color: "#ef4444", // Red
      votes: 0,
      teamMembers: ["Medical Research", "Machine Learning", "Healthcare IT"]
    },
    {
      id: 3,
      name: "PathFinders Pro",
      category: "Accessibility Tech",
      description: "Navigation System for Visually Impaired with real-time obstacle detection",
      color: "#8b5cf6", // Purple
      votes: 0,
      teamMembers: ["Computer Vision", "Accessibility Design", "Hardware Engineering"]
    },
    {
      id: 4,
      name: "Linguatech",
      category: "Language Technology",
      description: "Real-Time Multilingual Translation Platform with cultural context",
      color: "#3b82f6", // Blue
      votes: 0,
      teamMembers: ["Linguistics", "NLP Engineering", "Software Development"]
    },
    {
      id: 5,
      name: "EnergyMind",
      category: "Clean Energy",
      description: "Smart Grid Optimization System for efficient energy distribution",
      color: "#f59e0b", // Orange
      votes: 0,
      teamMembers: ["Electrical Engineering", "IoT Development", "Energy Management"]
    },
    {
      id: 6,
      name: "LexiAssist AI",
      category: "Education Technology",
      description: "Adaptive Language Learning Assistant with personalized curriculum",
      color: "#ec4899", // Pink
      votes: 0,
      teamMembers: ["Education Technology", "AI Development", "Pedagogy"]
    },
    {
      id: 7,
      name: "Project Insight",
      category: "Social Equity",
      description: "Equity and Accessibility platform for inclusive community solutions",
      color: "#06b6d4", // Cyan
      votes: 0,
      teamMembers: ["Social Sciences", "UI/UX Design", "Community Outreach"]
    },
    {
      id: 8,
      name: "Pivota",
      category: "Fintech & Security",
      description: "Cybersecurity and financial technology solutions for digital transactions",
      color: "#6366f1", // Indigo
      votes: 0,
      teamMembers: ["Cybersecurity", "Finance Technology", "Blockchain"]
    }
  ],
  
  // Additional event information
  eventDetails: {
    date: "November 15, 2024",
    time: "2:00 PM - 5:00 PM",
    location: "Tech Innovation Hub, Main Auditorium",
    organizer: "University Technology Department",
    votingRules: "One vote per participant. Voting closes at 4:30 PM."
  },
  
  // Categories for filtering
  categories: [
    "Environmental Tech",
    "Healthcare Technology", 
    "Accessibility Tech",
    "Language Technology",
    "Clean Energy",
    "Education Technology",
    "Social Equity",
    "Fintech & Security"
  ]
};

// Helper functions
export const getTotalVotes = () => {
  return votingData.candidates.reduce((sum, candidate) => sum + candidate.votes, 0);
};

export const getLeadingCandidate = () => {
  if (votingData.candidates.length === 0) return null;
  return [...votingData.candidates].sort((a, b) => b.votes - a.votes)[0];
};

export const getVotePercentage = (candidate) => {
  const total = getTotalVotes();
  return total > 0 ? ((candidate.votes / total) * 100).toFixed(1) : 0;
};

export const resetAllVotes = () => {
  votingData.candidates.forEach(candidate => {
    candidate.votes = 0;
  });
  votingData.totalVotes = 0;
};

export default votingData;