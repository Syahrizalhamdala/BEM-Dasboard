import apiClient from './apiClient';

export async function scanAttendance(payload) {
  const { data } = await apiClient.post('/attendance/scan', payload);
  return data;
}

export async function getAttendance(params = {}) {
  const { data } = await apiClient.get('/attendance', { params });
  return data.data;
}

export async function getMyAttendance() {
  const { data } = await apiClient.get('/attendance/my');
  return data.data;
}

export async function getAttendanceStats() {
  const { data } = await apiClient.get('/attendance/statistik');
  return data.data;
}

export async function getAgendaQr(agendaId) {
  const { data } = await apiClient.get(`/attendance/agenda/${agendaId}/qr`);
  return data.data;
}

export async function regenerateAgendaQr(agendaId) {
  const { data } = await apiClient.post(`/attendance/agenda/${agendaId}/qr/regenerate`);
  return data.data;
}

export async function getCampusLocation() {
  const { data } = await apiClient.get('/attendance/campus-location');
  return data.data;
}
