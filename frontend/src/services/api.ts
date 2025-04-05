import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Loan Application API
export const loanApplicationApi = {
  create: async (data: any) => {
    const response = await api.post('/loan-applications', data);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/loan-applications/${id}`);
    return response.data;
  },
  getByUserId: async (userId: string) => {
    const response = await api.get(`/loan-applications/user/${userId}`);
    return response.data;
  },
  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/loan-applications/${id}/status`, { status });
    return response.data;
  },
};

// Document API
export const documentApi = {
  getUploadUrl: async (fileType: string, loanApplicationId: string) => {
    const response = await api.post('/documents/upload-url', { fileType, loanApplicationId });
    return response.data;
  },
  getStatus: async (documentId: string) => {
    const response = await api.get(`/documents/${documentId}/status`);
    return response.data;
  },
};

// Eligibility API
export const eligibilityApi = {
  check: async (data: any) => {
    const response = await api.post('/eligibility/check', data);
    return response.data;
  },
};

export default api; 