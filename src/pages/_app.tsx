import '~/styles/globals.css'

import { MantineProvider } from '@mantine/core'
import { type AppType } from 'next/app'
import Head from 'next/head'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'

import { api } from '~/utils/api'

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const colorScheme = 'dark'

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
          <Component {...pageProps} />
        </MantineProvider>
      </SessionProvider>
    </>
  )
}

export default api.withTRPC(MyApp)
