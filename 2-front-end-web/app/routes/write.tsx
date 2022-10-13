import React, { ReactNode } from 'react'
import BasicLayout from '~/components/layout/BasicLayout'

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

// Inner Components
