import React from 'react'
import BasicLayout from '~/core/component/home/BasicLayout'
import AccountSetting from '~/core/component/setting/AccountSetting'

type AccountProps = {}

function Account({ ...rest }: AccountProps) {
  return (
    <BasicLayout title="내 계정" hasBackButton>
      <AccountSetting />
    </BasicLayout>
  )
}
export default Account

// Inner Components
