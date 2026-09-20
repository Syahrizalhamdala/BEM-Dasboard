import apiClient from './apiClient';

// ─── PUBLIC (tanpa token) ───

export async function getPublicMagang() {
  const res = await apiClient.get('/magang');
  return res.data.data;
}

export async function getPublicMagangById(id) {
  const res = await apiClient.get(`/magang/${id}`);
  return res.data.data;
}

export async function applyMagang(magangId, formData) {
  const res = await apiClient.post(`/magang/${magangId}/apply`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

// ─── ADMIN (perlu token) ───

export async function getAdminMagang() {
  const res = await apiClient.get('/admin/magang');
  return res.data.data;
}

export async function createMagang(formData) {
  const res = await apiClient.post('/admin/magang', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function updateMagang(id, formData) {
  const res = await apiClient.post(`/admin/magang/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function deleteMagang(id) {
  const res = await apiClient.delete(`/admin/magang/${id}`);
  return res.data;
}

export async function getMagangApplications(filters = {}) {
  const params = new URLSearchParams();
  if (filters.magang_id) params.append('magang_id', filters.magang_id);
  if (filters.status) params.append('status', filters.status);
  const res = await apiClient.get(`/admin/magang-applications?${params.toString()}`);
  return res.data.data;
}

export async function updateApplicationStatus(id, status) {
  const res = await apiClient.put(`/admin/magang-applications/${id}`, {
    status_pendaftaran: status,
  });
  return res.data;
}
