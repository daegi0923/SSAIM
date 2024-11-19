import { create } from 'zustand';

interface PmIdState {
  pmId: number | null;
  setPmId: (pmId: number) => void;
}

const usePmIdStore = create<PmIdState>((set) => ({
  pmId: null,
  setPmId: (pmId) => set({ pmId }),
}));

export default usePmIdStore;
