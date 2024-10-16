import axios from 'axios';

import { Fields } from '@models/localStorage';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + import.meta.env.VITE_API_PATH,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(Fields.Token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {

    return Promise.reject(error);
  }
);

export default axiosInstance;
