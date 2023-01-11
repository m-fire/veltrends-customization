import { useNavigate } from '@remix-run/react'
import LayoutBase from '~/core/component/LayoutBase'
import WriteForm from '~/core/component/write/WriteForm'
import { useWriteContext } from '~/core/context/WriteContext'
import LabelInput from '~/core/component/LabelInput'
import { APP_ERRORS_INFO } from '~/common/error/AppError'

const ERROR_CODE_INVALID_URL = APP_ERRORS_INFO.InvalidUrl.statusCode

//Todo: 글쓰기폼 UI는 디바이스 스크린사이즈에 따라 너비 폭 줄이거나 키움
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
    <LayoutBase title="링크 입력" hasBackButton>
      <WriteForm
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
      </WriteForm>
      {/* <Button onClick={() => navigate('/write/intro')}>다음</Button> */}
    </LayoutBase>
  )
}

export default WriteLink
