// src/api/apiClient.ts

import axios from 'axios';
import config from '../config/config'; // BASE_URL을 가져오기 위해 config.ts 불러오기

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: config.BASE_URL, // 환경에 따라 다른 BASE_URL 적용
});

// 요청 인터셉터 설정 (예: 토큰 추가)
apiClient.interceptors.request.use(
  (config) => {
    // 로컬스토리지에서 토큰 가져오기
    const userStorage = localStorage.getItem('user-storage');
    if (userStorage) {
      try {
        const { token } = JSON.parse(userStorage).state; // JSON 파싱 후 token 가져오기
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('Authorization Header:', config.headers.Authorization);
        }
      } catch (error) {
        console.error('Failed to parse user-storage from localStorage', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 설정 (예: 에러 핸들링)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 예: 토큰 만료 시 로그아웃 처리 등
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized: Redirecting to login');
      // 로그아웃 또는 리다이렉트 추가 가능
    }
    if (error.response && error.response.status === 403) {
      console.error('Unauthorized: Redirecting to login');
      // 로그아웃 또는 리다이렉트 추가 가능
    }
    return Promise.reject(error);
  }
);

export default apiClient;
