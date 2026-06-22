import apiClient from './apiClient';

export async function getAnggota() {
  const { data } = await apiClient.get('/anggotas');
  return data.data;
}

export async function tambahAnggota(form) {
  const { data } = await apiClient.post('/anggotas', form);
  return data.data;
}

export async function updateAnggota(id, form) {
  const { data } = await apiClient.put(`/anggotas/${id}`, form);
  return data.data;
}

export async function deleteAnggota(id) {
  const { data } = await apiClient.delete(`/anggotas/${id}`);
  return data;
}

export async function toggleStatusAnggota(id) {
  const { data } = await apiClient.put(`/anggotas/${id}/status`);
  return data;
}
