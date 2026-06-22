import apiClient from './apiClient';

export async function getDashboardStats() {
  const { data } = await apiClient.get('/dashboard/stats');
  return data.data;
}

export async function getAgendaTerdekat() {
  const { data } = await apiClient.get('/agenda/terdekat');
  return data.data;
}

export async function getDashboardCharts() {
  const { data } = await apiClient.get('/dashboard/stats');
  return data.data;
}

export async function getRecentAnggota(limit = 5) {
  const { data } = await apiClient.get('/kabinet');
  return data.data.slice(0, limit);
}

export async function getRecentActivities() {
  const { data } = await apiClient.get('/dashboard/recent-activities');
  return data.data;
}
