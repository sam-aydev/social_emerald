import { create } from "zustand";

type UIState = {
  isCreateModalOpen: boolean;
  closeCreateModal: () => void;
  openCreateModal: () => void;
};
export const useUIStore = create<UIState>((set) => ({
  isCreateModalOpen: false,
  openCreateModal: () => set({ isCreateModalOpen: true }),
  closeCreateModal: () => set({ isCreateModalOpen: false }),
}));
