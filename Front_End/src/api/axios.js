import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3500/api';

export default axios.create({
  baseURL: baseURL,
  withCredentials: false
});

export const axiosPrivate = axios.create({
  baseURL: baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false
});