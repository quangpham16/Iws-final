import axios from "axios";

const BASE = "/api/auth";

export const authApi = {
  login: (email, password) =>
    axios.post(`${BASE}/login`, { email, password }),

  register: (email, password, fullName) =>
    axios.post(`${BASE}/register`, { email, password, fullName }),
};
