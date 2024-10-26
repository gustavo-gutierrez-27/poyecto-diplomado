// axiosConfig.ts
import axios from 'axios';
import https from 'https';

const axiosInstance = axios.create({
  baseURL: 'https://localhost:8443',
  httpsAgent: new https.Agent({
    rejectUnauthorized: false  // Ignorar problemas de certificado en localhost
  })
});

export default axiosInstance;
