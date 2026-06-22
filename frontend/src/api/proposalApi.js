import apiClient from './apiClient';

export async function getGuidelines() {
  const { data } = await apiClient.get('/proposal/guidelines');
  return data.data;
}

export async function getAktifGuideline() {
  const { data } = await apiClient.get('/proposal/guideline/aktif');
  return data.data;
}

export async function uploadGuideline(file, judul) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('judul', judul);
  const { data } = await apiClient.post('/proposal/guideline', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function checkProposal(file) {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await apiClient.post('/proposal/check', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function getChecks() {
  const { data } = await apiClient.get('/proposal/checks');
  return data.data;
}

export async function getCheckDetail(id) {
  const { data } = await apiClient.get(`/proposal/check/${id}`);
  return data.data;
}

export async function getReviewQueue() {
  const { data } = await apiClient.get('/proposal/review-queue');
  return data.data;
}

export async function reviewProposal(id, action, notes = '') {
  const { data } = await apiClient.post(`/proposal/${id}/review`, { action, notes });
  return data;
}

export async function getPendingSignatures() {
  const { data } = await apiClient.get('/proposal/pending-signatures');
  return data.data;
}

export async function signProposal(id, signatureBase64) {
  const { data } = await apiClient.post(`/proposal/${id}/sign`, { signature: signatureBase64 });
  return data;
}

export async function downloadSigned(id) {
  const { data } = await apiClient.get(`/proposal/${id}/download`, {
    responseType: 'blob',
  });
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `surat_pengesahan_${id}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
