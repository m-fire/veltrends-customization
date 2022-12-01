import { useNavigate } from '@remix-run/react'
import BasicLayout from '~/common/component/layout/BasicLayout'
import WriteFormTemplate from '~/core/component/write/WriteFormTemplate'
import { useWriteContext } from '~/core/context/WriteContext'
import LabelInput from '~/common/component/system/LabelInput'
import { APP_ERRORS_INFO } from '~/common/error/AppError'

const ERROR_CODE_INVALID_URL = APP_ERRORS_INFO.InvalidUrl.statusCode

function WriteLink() {
  const navigate = useNavigate()
  const {
    state: {
      form: { link },
      error,
    },
    action: { change: changeFormData },
  } = useWriteContext()

  return (
    <BasicLayout title="링크 입력" hasBackButton>
      <WriteFormTemplate
        description="공유하고 싶은 URL을 입력하세요."
        buttonText="다음"
        onSubmit={(e) => {
          e.preventDefault()
          navigate('/write/intro')
        }}
      >
        <LabelInput
          label="URL"
          placeholder="https://example.com"
          name="url"
          value={link}
          onChange={(e) => {
            changeFormData('link', e.target.value)
          }}
          errorMessage={
            error?.statusCode === ERROR_CODE_INVALID_URL
              ? '유효하지 않은 URL 입니다'
              : undefined
          }
        />
      </WriteFormTemplate>
      {/* <Button onClick={() => navigate('/write/intro')}>다음</Button> */}
    </BasicLayout>
  )
}

export default WriteLink
