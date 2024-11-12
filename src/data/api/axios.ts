/* eslint-disable no-param-reassign */
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ZEUS_ENDPOINTS } from 'constants/api';
import {
  getItemFromLocalStorage,
  isTokenExpired,
  logout,
  setItemInLocalStorage
} from 'utils';
import { ids, urls } from '../urls/index';

/**
 * Create multiple axios instances with different base URLs for easier
 * communication with different services.
 * Base URLs are dependent on current environment.
 * */

const partnerPortalApi: AxiosInstance = axios.create({
  baseURL: urls.baseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

const refreshAuthToken = async (failedRequest: AxiosRequestConfig) => {
  const rt = getItemFromLocalStorage('rt');
  let responseFailedRequest = null;
  if (!rt || isTokenExpired(rt)) {
    return Promise.reject(new Error('No refresh token found'));
  }
  const grant_type = 'refresh_token';
  const refresh_token = rt;

  try {
    const response = await partnerPortalApi.post(
      ZEUS_ENDPOINTS.USER_LOGIN_URL,
      { grant_type, refresh_token }
    );
    const newToken = response.data.access_token;
    if (newToken) {
      partnerPortalApi.defaults.headers['Authorization'] = `Bearer ${newToken}`;
    }
    setItemInLocalStorage('auth-token', newToken);

    const updatedRequest: AxiosRequestConfig = {
      ...failedRequest,
      headers: {
        ...failedRequest.headers,
        Authorization: `Bearer ${newToken}`
      }
    };
    responseFailedRequest = await partnerPortalApi(updatedRequest);
  } catch (err) {
    logout();
    console.error('Failed to refresh token', err);
    return Promise.reject(err);
  }
  return responseFailedRequest;
};

partnerPortalApi.interceptors.request.use((request) => {
  if (request && request.headers) {
    if (!request.headers['skip-auth']) {
      // Add Authorization, Partner-ID, and Client-ID headers if 'skip-auth' is not set
      request.headers['Authorization'] = `Bearer ${getItemFromLocalStorage(
        'auth-token'
      )}`;
    }
    request.headers['Partner-ID'] = ids.partnerId || '';
    request.headers['Client-ID'] = ids.clientId || '';
  }
  return request;
});

partnerPortalApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      error.response &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        return await refreshAuthToken(originalRequest);
      } catch (refreshError) {
        console.error('Failed to refresh token', refreshError);
        localStorage.clear();
        logout();
        return Promise.reject(refreshError);
      }
    }
    if (error.response.status === 403) {
      // Do something here.
    }
    return Promise.reject(error);
  }
);

export { partnerPortalApi };
