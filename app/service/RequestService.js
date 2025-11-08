import HttpService from './HttpService';

const RequestService = {
  // Example: Get all requests
  getAllRequests: async () => {
    try {
      const response = await HttpService.get('/api/requests'); // Adjust endpoint as needed
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch requests: ${error.message}`);
    }
  },

  // Example: Create a new request
  createRequest: async (requestData) => {
    try {
      const response = await HttpService.post('/api/requests', requestData);
      return response;
    } catch (error) {
      throw new Error(`Failed to create request: ${error.message}`);
    }
  },
};

export default RequestService;