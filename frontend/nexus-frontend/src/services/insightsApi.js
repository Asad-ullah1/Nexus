// src/services/insightsApi.js
import api from '../lib/api';

export const insightsApi = {
  // Get all insights
  getAll: () => api.get('/insights'),

  // Get single insight by ID
  getById: (id) => api.get(`/insights/${id}`),

  // Create new insight
  create: (insightData) => api.post('/insights', insightData),

  // Update entire insight (full update)
  update: (id, insightData) => api.put(`/insights/${id}`, insightData),

  // Update insight text/summary only
  updateInsight: (id, text) => {
    return api.put(`/insights/${id}/text`, { text });
  },

  // Patch insight (partial update)
  patch: (id, insightData) => api.patch(`/insights/${id}`, insightData),

  // Delete insight
  delete: (id) => api.delete(`/insights/${id}`),
};

export default insightsApi;
