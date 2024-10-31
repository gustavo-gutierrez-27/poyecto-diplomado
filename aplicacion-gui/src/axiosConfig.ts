// axiosConfig.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // Mantener http ya que el endpoint es http
});

export default axiosInstance;
