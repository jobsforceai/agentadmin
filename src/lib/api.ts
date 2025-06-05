import axios from 'axios';
import { getAuthToken } from './auth';

const API_BASE_URL = 'https://api.jobsforce.ai/api';

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include auth token in requests
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.agentadmintoken = token;
  }
  return config;
});

// Auth endpoints
export const loginAdmin = async (email: string, password: string) => {
  const response = await api.post('/agentadmin/login', { email, password });
  return response.data;
};

// Agent management endpoints
export const createAgent = async (agentData: {
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  role?: 'selfapply' | 'userapply';
}) => {
  const response = await api.post('/agentadmin/create-agent', agentData);
  return response.data;
};

export const getAllAgents = async (params: {
  search?: string;
  role?: 'selfapply' | 'userapply';
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) => {
  const response = await api.get('/agentadmin/get-all-agents', { params });
  return response.data;
};

export const updateAgentType = async (data: {
  agentId: string;
  type: 'selfapply' | 'userapply';
}) => {
  const response = await api.put('/agentadmin/update-agent', data);
  return response.data;
};

export const getAgentDetails = async (data: { agentId: string }) => {
  const response = await api.post('/agentadmin/check-agent', data);
  return response.data;
};

// User management endpoints
export const searchUsers = async (params: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const response = await api.get('/agentadmin/search-users', { params });
  return response.data;
};

export const assignUsersToAgent = async (data: {
  agentId: string;
  userIds: string[];
}) => {
  const response = await api.post('/agentadmin/assign-users', data);
  return response.data;
};

export const authorizeUser = async (data: { userId: string }) => {
  const response = await api.patch('/agentadmin/authorize-user', data);
  return response.data;
};

export const deauthorizeUser = async (data: { userId: string }) => {
  const response = await api.patch('/agentadmin/deauthorize-user', data);
  return response.data;
};

// Stats and data endpoints
export const getJobsApplied = async (params: {
  userId: string;
  status?: 'applied' | 'received';
  page?: number;
  limit?: number;
}) => {
  const response = await api.get('/agentadmin/get-jobs-applied', { params });
  return response.data;
};

export const getMeetEvents = async (params: {
  userId?: string;
  email?: string;
  status?: 'scheduled' | 'attended' | 'cancelled';
}) => {
  const response = await api.get('/agentadmin/meet-events', { params });
  return response.data;
};

export default api;