import axiosInstance from './axiosInstance.js';

export const searchVideos = (params) => {
  return axiosInstance.get('/videos/search', { params });
};

export const getVideoDetails = (videoId) => {
  return axiosInstance.get(`/videos/${videoId}`);
};
