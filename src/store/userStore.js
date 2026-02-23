import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (data) => set({ user: data }),
      logout: () => set({ user: null })
    }),
    {
      name: 'user-storage', // localStorage key
    }
  )
)

export default useUserStore;