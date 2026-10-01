const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const API_ENDPOINTS = {
  health: `${BASE_URL}/health`,
  predict: `${BASE_URL}/predict`,
  history: `${BASE_URL}/history`,
  historyById: (id) => `${BASE_URL}/history/${id}`,
  dashboard: `${BASE_URL}/dashboard`,
  modelMetrics: `${BASE_URL}/model/metrics`,
  modelInfo: `${BASE_URL}/model/info`,
  datasetStats: `${BASE_URL}/dataset/stats`,
  liveNews: `${BASE_URL}/live-news`,
};

export default BASE_URL;
