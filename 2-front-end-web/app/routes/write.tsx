import React, { ReactNode } from 'react'
import { LoaderFunction, redirect } from '@remix-run/node'
import { Authenticator } from '~/core/api/auth'
import { Outlet } from '@remix-run/react'
import { WriteContextProvider } from '~/core/context/WriteContext'

type WriteProps = {
  children?: ReactNode
}

function Write({}: WriteProps) {
  return (
    <WriteContextProvider>
      <Outlet />
    </WriteContextProvider>
  )
}
export default Write

export const loader: LoaderFunction = async ({ request }) => {
  if (await Authenticator.isAuthenticated(request)) return null
  redirect(`/auth/login?next=/write`)
}

// Inner Components
