import React from 'react'
import { Outlet } from '@remix-run/react'
import { LoaderFunction, redirect } from '@remix-run/node'
import { Authenticator } from '~/core/api/auth'

type AuthProps = {}

function Auth({}: AuthProps) {
  return <Outlet />
}
export default Auth

export const loader: LoaderFunction = async ({ request }) => {
  if (await Authenticator.isAuthenticated(request)) redirect(`/`)
  return null
}

// Inner Components
