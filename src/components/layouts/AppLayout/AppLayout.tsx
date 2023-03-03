import { AppShell, Button, Group, Header } from '@mantine/core'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

type Props = {
  children: React.ReactNode
}

export const AppLayout = ({ children }: Props) => {
  const AppHeader = () => {
    return (
      <Header height={60} className="flex px-4">
        <Group>
          <Link href="/" className="text-xl font-bold text-white no-underline">
            Refiner
          </Link>
          <Group>
            <Button onClick={() => signOut()}>Sign out</Button>
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
