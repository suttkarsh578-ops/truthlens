import { useState, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const apiClient = axios.create({
  timeout: 10000,
});

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (requestFn) => {
    setLoading(true);
    setError(null);
    try {
      const response = await requestFn();
      return { data: response.data, error: null, loading: false };
    } catch (err) {
      const errMsg = err.response?.data?.detail || err.message || 'An unexpected error occurred';
      setError(errMsg);
      return { data: null, error: errMsg, loading: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHealth = useCallback(() => {
    return execute(() => apiClient.get(API_ENDPOINTS.health));
  }, [execute]);

  const fetchDashboard = useCallback(() => {
    return execute(() => apiClient.get(API_ENDPOINTS.dashboard));
  }, [execute]);

  const fetchHistory = useCallback((params) => {
    return execute(() => apiClient.get(API_ENDPOINTS.history, { params }));
  }, [execute]);

  const submitAnalysis = useCallback((data) => {
    return execute(() => apiClient.post(API_ENDPOINTS.predict, data));
  }, [execute]);

  const fetchModelMetrics = useCallback(() => {
    return execute(() => apiClient.get(API_ENDPOINTS.modelMetrics));
  }, [execute]);

  const fetchDatasetStats = useCallback(() => {
    return execute(() => apiClient.get(API_ENDPOINTS.datasetStats));
  }, [execute]);

  const fetchLiveNews = useCallback((params) => {
    return execute(() => apiClient.get(API_ENDPOINTS.liveNews, { params }));
  }, [execute]);

  return {
    loading,
    error,
    fetchHealth,
    fetchDashboard,
    fetchHistory,
    submitAnalysis,
    fetchModelMetrics,
    fetchDatasetStats,
    fetchLiveNews
  };
};
