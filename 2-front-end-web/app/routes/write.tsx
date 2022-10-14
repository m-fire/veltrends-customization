import React, { ReactNode } from 'react'
import BasicLayout from '~/components/layout/BasicLayout'
import { LoaderFunction, redirect } from '@remix-run/node'
import { Authenticator } from '~/common/api/auth'

type WriteProps = {
  children?: ReactNode
}

function Write({ children }: WriteProps) {
  return (
    <BasicLayout title="새 글 작성" hasBackButton>
      {children}
    </BasicLayout>
  )
}
export default Write

export const loader: LoaderFunction = async ({ request }) => {
  const isAuthenticated = await Authenticator.checkRequest(request)
  if (!isAuthenticated) return redirect(`/login?next=/write`)
  return null
}

// Inner Components
