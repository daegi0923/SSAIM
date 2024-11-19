// src/stores/userStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 상태 인터페이스 정의
interface UserState {
  isLogin: boolean;
  token: string | null;
  userId: number | null;
  userName : string | null;
  userProfileImage: string | null;
  role: string | null;
  login: (token: string, userId: number, role: string) => void;
  logout: () => void;
  setUserInfo : (name:string, profileImage:string) => void;
}

// persist 미들웨어 적용
const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isLogin: false,
      token: null,
      userId: null,
      role: null,
      userName : null,
      userProfileImage: null,

      // 로그인 함수: 토큰과 사용자 정보를 업데이트하고 isLogin 상태를 true로 설정
      login: (token, userId, role) => {
        set({
          isLogin: true,
          token,
          userId,
          role,
        });
        console.log('login success!', 'userId : ', userId, 'token : ', token, 'role : ', role);
      },

      // 로그아웃 함수: 상태를 초기화하고 isLogin을 false로 설정
      logout: () => {
        set({
          isLogin: false,
          token: null,
          userId: null,
          role: null,
        });
      },
      setUserInfo: (userName, userProfileImage) => {
        set({ userName, userProfileImage });
        console.log('User information updated', 'name : ', userName, 'profileImage : ', userProfileImage);
      }
    }),
    {
      name: 'user-storage', // localStorage의 키 이름 설정
      partialize: (state) => ({
        isLogin: state.isLogin,
        token: state.token,
        userId: state.userId,
        role: state.role,
      }), // 저장할 항목 선택
    }
  )
);

export default useUserStore;
