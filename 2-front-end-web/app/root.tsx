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
import GlobalStyle from '~/GlobalStyle'
import { Authenticator, User } from '~/common/api/auth'
import { setClientCookie } from '~/common/api/client'
import AppError from '~/common/error/AppError'
import { UserContext } from '~/context/UserContext'

export default function App() {
  const data = useLoaderData<User | undefined>()

  return (
    <html lang="ko">
      <head>
        <Meta />
        <Links />
        {typeof document === 'undefined' ? '__STYLES__' : null}
      </head>
      <body>
        <GlobalStyle />
        <UserContext.Provider value={data}>
          <Outlet />
        </UserContext.Provider>
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
  try {
    const userAndTokens = await Authenticator.getAccount()
    console.log(`Root.loader() getAccount() try!`)
    return userAndTokens
  } catch (e) {
    const error = AppError.extract(e)
    console.log(`Root.loader() error, e:`, error, e)
    if (error.name === 'UnauthorizedError') {
      console.log(error.payload)
    }
    return null
  }
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1',
})
