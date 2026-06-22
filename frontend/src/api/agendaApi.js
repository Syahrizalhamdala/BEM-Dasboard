import apiClient from './apiClient';

export async function getAgenda() {
  const { data } = await apiClient.get('/agenda');
  return data.data;
}

export async function tambahAgenda(data) {
  const { data: res } = await apiClient.post('/agenda', data);
  return res.data;
}

export async function updateAgenda(id, data) {
  const { data: res } = await apiClient.put(`/agenda/${id}`, data);
  return res.data;
}

export async function deleteAgenda(id) {
  const { data: res } = await apiClient.delete(`/agenda/${id}`);
  return res;
}

export async function getAgendaQr(id) {
  const { data } = await apiClient.get(`/attendance/agenda/${id}/qr`);
  return data.data;
}

export async function toggleAgendaQr(id) {
  const { data } = await apiClient.post(`/agenda/${id}/qr/toggle`);
  return data;
}

export async function regenerateAgendaQr(id) {
  const { data } = await apiClient.post(`/attendance/agenda/${id}/qr/regenerate`);
  return data.data;
}
