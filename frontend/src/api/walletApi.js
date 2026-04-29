import axios from "axios";

const BASE = "/api/wallets";

export const walletApi = {
  getAll: () => axios.get(BASE),
  getById: (id) => axios.get(`${BASE}/${id}`),
  search: (keyword) => axios.get(`${BASE}/search`, { params: { keyword } }),
  getTotalBalance: () => axios.get(`${BASE}/total-balance`),
  create: (data) => axios.post(BASE, data),
  update: (id, data) => axios.put(`${BASE}/${id}`, data),
  delete: (id) => axios.delete(`${BASE}/${id}`),
};
