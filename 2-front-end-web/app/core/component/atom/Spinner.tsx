import styled, { keyframes } from 'styled-components'
import { globalColors } from '~/common/style/global-colors'
import { Loading } from '~/core/component/generate/svg'

type SpinnerProps = {}

function Spinner({}: SpinnerProps) {
  return <StyledSpinner />
}
export default Spinner

// Inner Components

const spin = keyframes`
  100% {
    transform: rotate(360deg);
  }
`

const StyledSpinner = styled(Loading)`
  width: 24px;
  height: 24px;
  display: block;
  color: ${globalColors.grey2};
  animation: ${spin} 1s infinite steps(8);
`
