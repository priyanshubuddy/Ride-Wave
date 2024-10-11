import axios from 'axios';

const devUrl = 'http://192.168.220.22:3000';
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
