import {
  AppShell,
  Button,
  Center,
  Group,
  Header,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useMantineTheme,
} from '@mantine/core'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'

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
          <Link href="/">Refiner</Link>
          <Group>
            <Button onClick={() => signIn()}>Sign in</Button>
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
