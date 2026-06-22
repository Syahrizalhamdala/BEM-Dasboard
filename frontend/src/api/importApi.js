import apiClient from './apiClient';

export async function importExcel(file) {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await apiClient.post('/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function getAnggotas() {
  const { data } = await apiClient.get('/anggotas');
  return data.data;
}

export async function getProgramKerja() {
  const { data } = await apiClient.get('/program-kerja');
  return data.data;
}
