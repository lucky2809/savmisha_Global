import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      setAuth: (user, token) => set({ user, token }),

      logout: () => {
        set({ user: null, token: null })
        localStorage.removeItem("access_token")
      }
    }),
    {
      name: 'auth-storage',
    }
  )
)

export default useUserStore;