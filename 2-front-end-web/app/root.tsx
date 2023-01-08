import React, { useEffect, useState, Suspense } from 'react'
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
import { Authenticator } from '~/core/api/auth'
import { Clients } from '~/common/api/client'
import AppError from '~/common/error/AppError'
import { UserContext } from '~/common/context/UserContext'
import { SimpleUser } from '~/common/api/types'
import { DialogContextProvider } from '~/common/context/DialogContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import GlobalBottomSheetModal from '~/core/component/GlobalBottomSheetModal'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 쿼리가 새로 고침에서 오래된 것으로 전환될 때까지의 기간입니다.
      // 쿼리가 새로 작성된 경우 데이터는 항상 캐시에서만 읽힙니다. 네트워크 요청은 발생하지 않습니다!
      // ref: https://stackoverflow.com/questions/72828361/what-are-staletime-and-cachetime-in-react-query
      staleTime: 1000 * 6,
    },
  },
})

const ReactQueryDevtoolsProduction = React.lazy(() =>
  import('@tanstack/react-query-devtools/build/lib/index.prod.js').then(
    (d) => ({
      default: d.ReactQueryDevtools,
    }),
  ),
)

export default function App() {
  const [showDevtools, setShowDevtools] = useState(false)
  useEffect(() => {
    // @ts-ignore
    window.toggleDevtools = () => setShowDevtools((old) => !old)
  }, [])

  const data = useLoaderData<SimpleUser | null>()

  return (
    <html lang="ko">
      <head>
        <Meta />
        <Links />
        {typeof document === 'undefined' ? '__STYLES__' : null}
      </head>
      <body>
        <GlobalStyle />

        <QueryClientProvider client={queryClient}>
          <DialogContextProvider>
            <UserContext.Provider value={data}>
              <Outlet />
            </UserContext.Provider>
          </DialogContextProvider>
          <GlobalBottomSheetModal />

          <ReactQueryDevtools initialIsOpen />
          {showDevtools && (
            <Suspense fallback={null}>
              <ReactQueryDevtoolsProduction />
            </Suspense>
          )}
        </QueryClientProvider>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export const loader: LoaderFunction = async ({ request, context }) => {
  const cookie = request.headers.get('Cookie')
  /*
  const redirectIfNeeded = () => {
    const { pathname, search } = new URL(request.url)
    const isProtected = PROTECTED_ROUTES.some((route) =>
      pathname.includes(route),
    )
    if (isProtected) {
      return redirect('/login?next=' + encodeURIComponent(pathname + search))
    }
    return null
  }
*/
  // if (!cookie) return redirectIfNeeded()
  if (!cookie) return null

  Clients.setCookie(cookie)
  try {
    const userAndTokens = await Authenticator.getAccount()
    return userAndTokens
  } catch (e) {
    const error = AppError.extract(e)
    if (error.name === 'Unauthorized') {
      // console.log(error.payload)
    }

    // return redirectIfNeeded()
    return null
  }
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1',
})
