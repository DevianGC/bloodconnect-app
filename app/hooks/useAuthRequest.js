import { useState } from 'react';
import HttpService from '../service/HttpService';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

const useAuthRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await HttpService.post(API_ENDPOINTS.LOGIN, credentials);
      setIsLoading(false);
      return response;
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
      throw err;
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await HttpService.post(API_ENDPOINTS.REGISTER, userData);
      setIsLoading(false);
      return response;
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
      throw err;
    }
  };

  return { login, register, isLoading, error };
};

export default useAuthRequest;