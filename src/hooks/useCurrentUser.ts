import { useSession } from 'next-auth/react'

export function useCurrentUser() {
  const { data, status } = useSession()
  return {
    currentUser: !data || !data.user ? null : { ...data.user },
    status,
  }
}
