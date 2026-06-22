import apiClient from './apiClient';

export async function getLaporan() {
  const { data } = await apiClient.get('/laporan');
  return data.data;
}

export async function tambahLaporan(formData) {
  const { data } = await apiClient.post('/laporan', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function updateLaporan(id, formData) {
  const { data } = await apiClient.post(`/laporan/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function deleteLaporan(id) {
  const { data } = await apiClient.delete(`/laporan/${id}`);
  return data;
}

export async function downloadLaporan(id) {
  const response = await apiClient.get(`/laporan/${id}/download`, {
    responseType: 'blob',
  });

  const disposition = response.headers['content-disposition'];
  const match = disposition && disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
  const filename = match ? match[1].replace(/['"]/g, '') : `laporan-${id}`;

  const url = URL.createObjectURL(response.data);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return true;
}
