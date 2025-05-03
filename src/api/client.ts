import axios, { AxiosInstance } from 'axios';

const client: AxiosInstance = axios.create({
  baseURL: 'https://localhost:5000/api', // Your backend API base URL
  timeout: 10000,
});


export default client;
