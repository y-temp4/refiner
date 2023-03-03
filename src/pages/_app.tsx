import '~/styles/globals.css'

import { MantineProvider } from '@mantine/core'
import type { NextPage } from 'next'
import { type AppProps } from 'next/app'
import Head from 'next/head'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { useMemo } from 'react'

import { DefaultLayout } from '~/components/layouts/DefaultLayout'
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

  return (
    <>
      <Head>
        <title>Refiner</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
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
