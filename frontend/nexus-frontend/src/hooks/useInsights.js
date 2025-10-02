// src/hooks/useInsights.js
import { useState, useCallback } from 'react';
import insightsApi from '../services/insightsApi';

export const useInsights = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateInsight = useCallback(async (id, text) => {
    setLoading(true);
    setError(null);

    try {
      const response = await insightsApi.updateInsight(id, text);
      return response.data; // Return the updated insight
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update insight';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFullInsight = useCallback(async (id, insightData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await insightsApi.update(id, insightData);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update insight';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createInsight = useCallback(async (insightData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await insightsApi.create(insightData);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create insight';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteInsight = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      await insightsApi.delete(id);
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete insight';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateInsight,
    updateFullInsight,
    createInsight,
    deleteInsight,
    loading,
    error,
    setError,
  };
};

export default useInsights;
