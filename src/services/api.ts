// src/lib/api.ts
import axios from 'axios';
import supabase from '../api/supabase/client'; // adjust path if needed

//const API_URL = 'http://localhost:5000/api'; 
const API_URL = 'anamcara-be.vercel.app/api'; 
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Important: withCredentials must be true to send cookies (if needed)
  withCredentials: true
});

// Add request interceptor to include auth token in every request
api.interceptors.request.use(
  async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    console.log('SESSION IN API INTERCEPTOR:', session); // For debugging

    const token = session?.access_token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token attached to request:', `Bearer ${token.substring(0, 10)}...`); // Log partial token for security
    } else {
      console.warn('No auth token available to attach to request');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
