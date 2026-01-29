export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  register: `${API_BASE_URL}/api/register`,
  validate: `${API_BASE_URL}/api/validate`,
  vote: `${API_BASE_URL}/api/vote`,
  adminRegistrations: `${API_BASE_URL}/api/admin/registrations`,
  adminVotes: `${API_BASE_URL}/api/admin/votes`,
  certificateSend: `${API_BASE_URL}/api/certificate/send`,
  certificateSendAll: `${API_BASE_URL}/api/certificate/send-all`,
  teams: `${API_BASE_URL}/api/teams`,
};
