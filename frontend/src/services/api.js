import axios from 'axios';

const API_URL = 'https://expense-tracker-7bsb.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const signup = (email, password) => api.post('/auth/signup', { email, password });
export const login = (email, password) => api.post('/auth/login', { email, password });

// Category APIs
export const getCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Budget APIs
export const getBudgets = (month, year) => api.get('/budgets', { params: { month, year } });
export const createOrUpdateBudget = (data) => api.post('/budgets', data);
export const deleteBudget = (id) => api.delete(`/budgets/${id}`);

// Expense APIs
export const getExpenses = (params) => api.get('/expenses', { params });
export const createExpense = (data) => api.post('/expenses', data);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);

// Report APIs
export const getMonthlyReport = (month, year) => api.get('/reports/monthly', { params: { month, year } });

export default api;