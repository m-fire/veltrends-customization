import React from 'react'
import { Outlet } from '@remix-run/react'
import { LoaderFunction, redirect } from '@remix-run/node'
import { Authenticator } from '~/core/api/auth'
import AuthDesktopContainer from '~/core/component/auth/AuthDesktopContainer'

type AuthProps = {}

function Auth({}: AuthProps) {
  return (
    <AuthDesktopContainer>
      <Outlet />
    </AuthDesktopContainer>
  )
}
export default Auth

export const loader: LoaderFunction = async ({ request }) => {
  const isAuthenticated = await Authenticator.checkAuthenticated(request)
  if (isAuthenticated) return redirect('/')
  return null
}

// Inner Components
