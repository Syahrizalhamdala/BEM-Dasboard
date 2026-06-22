import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export async function askBot(question) {
  const { data } = await api.post('/chatbot/ask', { question });
  return data.data;
}

export async function importExcel(file) {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/chatbot/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function getStatus() {
  const { data } = await api.get('/chatbot/status');
  return data.data;
}
