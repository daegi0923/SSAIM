import { create } from 'zustand';

// 상태 인터페이스 정의
interface IndicatorStore {
  isUploading: boolean;
  uploadStartTime: number | null; // 업로드 시작 시간을 숫자(timestamp)로 저장
  elapsedTime: number;
  uploadMessage: string;
  errorMessage: string;
  navigationText: string;
  sprintTitle: string;

  uploadTimer: ReturnType<typeof setInterval> | null; // 수정: 타이머 타입
  startUpload: (uploadMessage: string, errorMessage: string, navigationText: string, sprintTitle: string) => void;
  updateElapsedTime: () => void;
  updateUploadMessage: (message: string) => void;
  setErrorMessage: (message: string) => void;
  completeUpload: () => void;
}

// Zustand 상태 관리
const useIndicatorStore = create<IndicatorStore>((set, get) => ({
  isUploading: false,
  uploadStartTime: null, // 처음엔 null로 설정
  elapsedTime: 0,
  uploadMessage: '',
  errorMessage: '',
  navigationText: '',
  sprintTitle: '',
  uploadTimer: null,

  startUpload: (uploadMessage, errorMessage, navigationText, sprintTitle) => {
    // 업로드 시작 상태 설정
    set({
      isUploading: true,
      uploadStartTime: Date.now(),
      elapsedTime: 0,
      uploadMessage,
      errorMessage,
      navigationText,
      sprintTitle,
    });

    // 타이머 시작
    const timer = setInterval(() => {
      set((state) => {
        if (state.isUploading && state.uploadStartTime) {
          const elapsedTime = Math.floor((Date.now() - state.uploadStartTime) / 1000);
          return { elapsedTime };
        }
        return state;
      });
    }, 1000);

    // 타이머를 상태에 저장
    set({ uploadTimer: timer });
  },

  updateElapsedTime: () => {
    set((state) => {
      if (state.isUploading && state.uploadStartTime) {
        const elapsedTime = Math.floor((Date.now() - state.uploadStartTime) / 1000); // 초 단위로 경과 시간 계산
        return { elapsedTime };
      }
      return state;
    });
  },

  updateUploadMessage: (message: string) => {
    set({ uploadMessage: message });
  },

  setErrorMessage: (message: string) => {
    set({ errorMessage: message });
  },

  completeUpload: () => {
    const timer = get().uploadTimer; // 상태에서 타이머 가져오기

    if (timer) {
      clearInterval(timer); // 타이머 정리
      set({ uploadTimer: null }); // 타이머 상태 초기화
    }

    // 업로드 완료 상태 설정
    set({
      isUploading: false,
      uploadMessage: '업로드 완료!',
    });
  },
}));

export default useIndicatorStore;
