import axios from 'axios';
import { IP_ADDRESS } from '../config';

const devUrl = `http://${IP_ADDRESS.trim()}:3000`;
const prodUrl = 'https://api.productionurl.com';

console.log(devUrl);
const axiosInstance = axios.create({
  baseURL: devUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
