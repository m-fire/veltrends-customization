import './style.css'
import React, { Suspense, useEffect, useState } from 'react'
import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
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
import { Clients } from '~/common/api/client'
import { DialogContextProvider } from '~/common/context/DialogContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import AppBottomSheetModal from '~/core/component/home/AppBottomSheetModal'
import Dialog from '~/common/component/template/Dialog'
import AppOverlay from '~/core/component/home/AppOverlay'
import { Account } from '~/common/api/types'
import { getUserStoreCreator, UserContext } from '~/common/store/user'
import { Me } from '~/core/api/me'

const initialQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 쿼리가 새로 고침에서 오래된 것으로 전환될 때까지의 기간입니다.
      // 쿼리가 새로 작성된 경우 데이터는 항상 캐시에서만 읽힙니다. 네트워크 요청은 발생하지 않습니다!
      // ref: https://stackoverflow.com/questions/72828361/what-are-staletime-and-cachetime-in-react-query
      staleTime: 1000 * 6,
    },
  },
})

// ReactQueryDevtools Component
const ReactQueryDevtoolsProduction = React.lazy(() =>
  import('@tanstack/react-query-devtools/build/lib/index.prod.js').then(
    (d) => ({
      default: d.ReactQueryDevtools,
    }),
  ),
)

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'App Veltrend',
  viewport: 'width=device-width,initial-scale=1',
})

export default function App() {
  const data = useLoaderData<{
    account: Account | null
  }>()

  // ReactQuery Devtools initialize
  const [showDevtools, setShowDevtools] = useState(false)
  useEffect(() => {
    // @ts-ignore
    window.toggleDevtools = () => setShowDevtools((old) => !old)
  }, [])

  return (
    <html lang="ko">
      <head>
        <Meta />
        <Links />
        {typeof document === 'undefined' ? '__STYLES__' : null}
      </head>
      <body>
        <GlobalStyle />

        <QueryClientProvider client={initialQueryClient}>
          <UserContext.Provider
            createStore={getUserStoreCreator(({ setUser }) =>
              setUser(data?.account ?? null),
            )}
          >
            <DialogContextProvider dialog={Dialog} overlay={AppOverlay}>
              <Outlet />
            </DialogContextProvider>
            <AppBottomSheetModal />
          </UserContext.Provider>

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
  if (!cookie) return json(null)

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

  Clients.setCookie(cookie)
  try {
    const { account, headers } = await Me.getAccountMemo()
    return json({ account }, headers ? { headers } : undefined)
  } catch (e) {
    return json(null)
  }
}
