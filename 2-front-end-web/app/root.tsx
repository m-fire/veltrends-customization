import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import GlobalStyle from '~/components/GlobalStyle'
import { getMe, User } from '~/common/api/auth'
import { setClientCookie } from '~/common/api/client'

export default function App() {
  const user = useLoaderData<User | undefined>()
  // console.log(`default.App() user:`, user)

  return (
    <html lang="ko">
      <head>
        <Meta />
        <Links />
        {typeof document === 'undefined' ? '__STYLES__' : null}
      </head>
      <body>
        <GlobalStyle />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = request.headers.get('Cookie')
  if (!cookie) return null
  setClientCookie(cookie)
  const me = await getMe()
  return me
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1',
})
