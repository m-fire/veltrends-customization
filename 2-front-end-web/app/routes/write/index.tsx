import { useNavigate } from '@remix-run/react'
import BasicLayout from '~/components/layout/BasicLayout'
import Button from '~/components/system/Button'

type WriteLinkProps = {}
function WriteLink({}: WriteLinkProps) {
  const navigate = useNavigate()

  return (
    <BasicLayout title="링크 입력" hasBackButton>
      <Button onClick={() => navigate('/write/intro')}>다음</Button>
    </BasicLayout>
  )
}

export default WriteLink
