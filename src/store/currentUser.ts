import type { Session } from 'next-auth'
import { create } from 'zustand'

type CurrentUserStore = {
  currentUser: Session['user'] | null
  setCurrentUser: (user: Session['user'] | null) => void
}

export const useCurrentUserStore = create<CurrentUserStore>((set) => ({
  currentUser: null,
  setCurrentUser: (currentUser) => set({ currentUser }),
}))
