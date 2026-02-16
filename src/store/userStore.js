import { create } from 'zustand'

const useUserStore = create((set) => {
    
   return  {
    user: null,
    setUser: (data) => set({ user: data })
}})

export default useUserStore;