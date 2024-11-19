import { create } from 'zustand';
import { TeamMemberDTO } from '@features/project/types/TeamMemberDTO';

interface TeamStore {
  members: TeamMemberDTO[];
  addMember: (member: TeamMemberDTO) => void;
  removeMember: (id: number) => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  leaderId: number;
  setLeaderId: (leaderId: number) => void;
  startDate: string | null;
  endDate: string | null;
  postId: number | null;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setPostId: (id: number) => void;
  resetStore: () => void; // 스토어 초기화 함수 추가
  setMembers: (members: TeamMemberDTO[]) => void;
}

const initialState = {
  members: [],
  isModalOpen: false,
  startDate: null, // 초기 상태 추가
  endDate: null, // 초기 상태 추가
  postId: null, // 초기 상태 추가
  leaderId: -1,
};

const useTeamStore = create<TeamStore>((set) => ({
  ...initialState,
  addMember: (member) =>
    set((state) => {
      // 이미 존재하는 멤버인지 확인
      const isDuplicate = state.members.some((m) => m.userId === member.userId);

      if (!isDuplicate && state.members.length < 10) {
        return { members: [...state.members, member] };
      }

      return state; // 중복 멤버는 추가하지 않음
    }),
  removeMember: (id) =>
    set((state) => ({
      members: state.members.filter((member) => member.userId !== id),
    })),
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  setLeaderId: (leaderId) => {
    set((state) => ({
      ...state,
      leaderId: leaderId,
    }));
  },
  setStartDate: (date) =>
    set((state) => ({
      ...state,
      startDate: date,
    })),
  setEndDate: (date) =>
    set((state) => ({
      ...state,
      endDate: date,
    })),
  setPostId: (id) =>
    set((state) => ({
      ...state,
      postId: id,
    })),
  resetStore: () => set({ ...initialState }), // 초기 상태로 재설정
  setMembers: (members) => {
    set({ members });
  },
}));

export default useTeamStore;
