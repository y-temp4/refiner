import '~/styles/globals.css'

import { MantineProvider } from '@mantine/core'
import type { NextPage } from 'next'
import { type AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { type Session } from 'next-auth'
import { getSession, SessionProvider } from 'next-auth/react'
import { useEffect, useMemo } from 'react'

import { DefaultLayout } from '~/components/layouts/DefaultLayout'
import { useCurrentUser } from '~/hooks/useCurrentUser'
import { useCurrentUserStore } from '~/store/currentUser'
import { api } from '~/utils/api'

type CustomNextPage = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

type CustomAppProps = {
  Component: CustomNextPage
} & AppProps<{
  session: Session | null
}>

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: CustomAppProps) => {
  const colorScheme = 'dark'
  const getLayout = useMemo(
    () =>
      Component.getLayout ??
      ((page: any) => <DefaultLayout>{page}</DefaultLayout>),
    [Component.getLayout]
  )
  const { pathname, push } = useRouter()
  async function getUser() {
    const session = await getSession()
    const user = session?.user || null
    return user
  }
  const store = useCurrentUserStore()

  useEffect(() => {
    async function init() {
      const currentUser = await getUser()
      store.setCurrentUser(currentUser)
      const authedPath = '/app'
      if (pathname.startsWith(authedPath) && !currentUser) {
        push('/')
      }
    }
    init()
    // eslint-disable-next-line
  }, [pathname, push, store.setCurrentUser])

  return (
    <>
      <Head>
        <title>Refiner</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SessionProvider session={session}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{ colorScheme }}
        >
          {getLayout(<Component {...pageProps} />)}
        </MantineProvider>
      </SessionProvider>
    </>
  )
}

export default api.withTRPC(MyApp)
