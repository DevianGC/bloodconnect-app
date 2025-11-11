export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',

  // Requests
  GET_ALL_REQUESTS: '/api/requests',
  CREATE_REQUEST: '/api/requests',

  // Donors
  GET_ALL_DONORS: '/api/donors',
  GET_DONOR_BY_ID: (id) => `/api/donors/${id}`,
};