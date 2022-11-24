import styled, { keyframes } from 'styled-components'
import { colors } from '~/common/style/colors'
import { Loading } from '~/components/generate/svg'

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
  color: ${colors.grey2};
  animation: ${spin} 1s infinite steps(8);
`
