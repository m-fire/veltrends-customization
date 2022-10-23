import { useNavigate } from '@remix-run/react'
import BasicLayout from '~/components/layout/BasicLayout'
import WriteFormTemplate from '~/components/write/WriteFormTemplate'
import { useWriteContext } from '~/context/WriteContext'
import LabelInput from '~/components/system/LabelInput'
import { APP_ERRORS_INFO } from '~/common/error/AppError'

const ERROR_CODE_INVALID_URL = APP_ERRORS_INFO.InvalidUrlError.statusCode

function WriteLink() {
  const navigate = useNavigate()
  const {
    state: {
      form: { link },
      error,
    },
    actions,
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
            actions.change('link', e.target.value)
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
