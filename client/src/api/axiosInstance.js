/**
 * @module api/axiosInstance
 * @description Pre-configured Axios instance.
 *
 * - Base URL from VITE_API_BASE_URL
 * - Attaches Authorization: Bearer <token> from tokenService on every request
 * - Response interceptor: silently refreshes token on 401 and retries once
 * - On failed refresh: dispatches logout and redirects to /login
 */

import axios from 'axios';
import tokenService from '../services/tokenService.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Send httpOnly cookies (refresh token) with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request interceptor: attach access token ─────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    // Let the browser set the Content-Type with the correct boundary for FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    const token = tokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Flag to prevent multiple simultaneous refresh attempts ───────────────────
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ─── Response interceptor: silent token refresh on 401 ────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh on 401, and not on the refresh endpoint itself
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/login')
    ) {
      if (isRefreshing) {
        // Queue subsequent requests while a refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axiosInstance.post('/auth/refresh');
        const newToken = data.data?.accessToken;

        tokenService.setToken(newToken);
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenService.clearToken();

        // Dispatch a custom event so the Redux store can react to logout
        window.dispatchEvent(new CustomEvent('auth:logout'));
        
        // Force redirect to login to break any potential loops immediately
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
