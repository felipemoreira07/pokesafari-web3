import { create } from "zustand";

// Define o tipo para a store
interface AppState {
  count: number;
  user: { name: string; age: number };
  isAuthenticated: boolean;
  increment: () => void;
  login: (name: string, age: number) => void;
  logout: () => void;
}

// Crie a store
const useAppStore = create<AppState>((set) => ({
  count: 0,
  user: { name: "", age: 0 },
  isAuthenticated: false,
  increment: () => set((state) => ({ count: state.count + 1 })),
  login: (name, age) =>
    set(() => ({
      user: { name, age },
      isAuthenticated: true,
    })),
  logout: () =>
    set(() => ({
      user: { name: "", age: 0 },
      isAuthenticated: false,
    })),
}));

export default useAppStore;
