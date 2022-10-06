import React from 'react'
import styled from 'styled-components'
import Input, { InputProps } from '~/components/Input'
import { colors } from '~/common/style/colors'

interface LabelInputProps extends InputProps {
  label: string
}

function LabelInput({ label, ...rest }: LabelInputProps) {
  return (
    <>
      <Block>
        <label>{label}</label>
        <Input {...rest} />
      </Block>
    </>
  )
}
export default LabelInput

// Inner Components

const Block = styled.div`
  display: flex;
  flex-direction: column;
  label {
    font-size: 16px;
    line-height: 1.5;
    color: ${colors.grey4};
    font-weight: 600;
    margin-bottom: 8px;
  }

  /* 부모컴포넌트에서 gap 속성값(16px) 설정 되었으므로 불필요함 */
  // 주의: 구형브라우저 적용불가
  //& + & {
  //  margin-top: 16px;
  //}
`
