import { AppShell, Button, Group, Header } from '@mantine/core'
import { IconApiApp } from '@tabler/icons-react'
import Link from 'next/link'
import { signIn, signOut } from 'next-auth/react'

import { useCurrentUser } from '~/hooks/useCurrentUser'

type Props = {
  children: React.ReactNode
}

export const DefaultLayout = ({ children }: Props) => {
  const { currentUser } = useCurrentUser()
  const AppHeader = () => {
    return (
      <Header height={60} px="md" className="p-4">
        <Group>
          <Link href="/" className="text-xl font-bold text-white no-underline">
            Refiner
          </Link>
          <Group>
            {!currentUser ? (
              <Button onClick={() => signIn()}>Sign in</Button>
            ) : (
              <Button onClick={() => signOut()}>Sign out</Button>
            )}
            {currentUser && (
              <Button
                leftIcon={<IconApiApp />}
                component={Link}
                href="/app"
                variant="white"
              >
                Go to App
              </Button>
            )}
          </Group>
        </Group>
      </Header>
    )
  }
  return (
    <AppShell padding="md" header={<AppHeader />}>
      {children}
    </AppShell>
  )
}
