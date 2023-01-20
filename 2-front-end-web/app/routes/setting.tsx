import React from 'react'
import { Outlet } from '@remix-run/react'
import TabLayout from '~/core/component/home/TabLayout'

type SettingProps = {}

function Setting({}: SettingProps) {
  return (
    <TabLayout>
      <Outlet />
    </TabLayout>
  )
}
export default Setting

// Inner Components
