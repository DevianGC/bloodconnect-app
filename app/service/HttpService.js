import axios from 'axios';

const HttpService = {
  get: async (url, headers = {}) => {
    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      throw new Error(`GET request to ${url} failed: ${error.message}`);
    }
  },

  post: async (url, data, headers = {}) => {
    try {
      const response = await axios.post(url, data, { headers });
      return response.data;
    } catch (error) {
      throw new Error(`POST request to ${url} failed: ${error.message}`);
    }
  },

  put: async (url, data, headers = {}) => {
    try {
      const response = await axios.put(url, data, { headers });
      return response.data;
    } catch (error) {
      throw new Error(`PUT request to ${url} failed: ${error.message}`);
    }
  },

  delete: async (url, headers = {}) => {
    try {
      const response = await axios.delete(url, { headers });
      return response.data;
    } catch (error) {
      throw new Error(`DELETE request to ${url} failed: ${error.message}`);
    }
  },
};

export default HttpService;