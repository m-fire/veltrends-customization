import React from 'react'
import { Outlet } from '@remix-run/react'
import TabLayout from '~/core/component/home/TabLayout'
import { LoaderFunction, redirect } from '@remix-run/node'
import { Authenticator } from '~/core/api/auth'

type SettingProps = {}

function Setting({}: SettingProps) {
  return <Outlet />
}
export default Setting

export const loader: LoaderFunction = async ({ request }) => {
  if (!(await Authenticator.isAuthenticated(request)))
    redirect(`/auth/login?next=/setting`)
  return null
}
// Inner Components
