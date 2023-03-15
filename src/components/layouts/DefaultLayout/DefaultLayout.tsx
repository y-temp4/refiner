import { AppShell, Button, Group, Header, Loader } from '@mantine/core'
import { IconApiApp } from '@tabler/icons-react'
import Link from 'next/link'
import { signIn, signOut } from 'next-auth/react'

import { useCurrentUser } from '~/hooks/useCurrentUser'

type Props = {
  children: React.ReactNode
}

export const DefaultLayout = ({ children }: Props) => {
  const { currentUser, status } = useCurrentUser()
  const HeaderItems = () => {
    if (status === 'loading') return <Loader variant="dots" />
    return currentUser ? (
      <>
        <Button
          leftIcon={<IconApiApp />}
          component={Link}
          href="/app"
          variant="white"
        >
          Go to App
        </Button>
        <Button onClick={() => signOut()}>Sign out</Button>
      </>
    ) : (
      <Button onClick={() => signIn('github')}>Sign in</Button>
    )
  }
  const AppHeader = () => {
    return (
      <Header height={60} className="flex justify-center px-4">
        <Group>
          <Link href="/" className="text-xl font-bold text-white no-underline">
            Refiner
          </Link>
          <Group>
            <HeaderItems />
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
