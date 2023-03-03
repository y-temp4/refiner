import { useSession } from 'next-auth/react'

export function useCurrentUser() {
  const { data } = useSession()
  return {
    currentUser: !data || !data.user ? null : { ...data.user },
  }
}
