import React, { ReactNode } from 'react'
import { LoaderFunction, redirect } from '@remix-run/node'
import { Authenticator } from '~/common/api/auth'
import { Outlet } from '@remix-run/react'
import { WriteProvider } from '~/context/WriteContext'

type WriteProps = {
  children?: ReactNode
}

function Write({}: WriteProps) {
  return (
    <WriteProvider>
      <Outlet />
    </WriteProvider>
  )
}
export default Write

export const loader: LoaderFunction = async ({ request }) => {
  const isAuthenticated = await Authenticator.checkRequest(request)
  if (!isAuthenticated) return redirect(`/login?next=/write`)
  return null
}

// Inner Components
