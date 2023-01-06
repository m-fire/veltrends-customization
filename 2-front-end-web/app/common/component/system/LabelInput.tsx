import React, { FocusEventHandler, forwardRef, useState } from 'react'
import styled, { css } from 'styled-components'
import Input, { InputProps } from '~/common/component/system/Input'
import { colors } from '~/core/style/colors'
import { Flex, Font } from '~/common/style/css-builder'

interface LabelInputProps extends InputProps {
  label: string
  errorMessage?: InputProps['errorMessage']
  onFocus?: FocusEventHandler<HTMLInputElement>
  onBlur?: FocusEventHandler<HTMLInputElement>
  defaultValue?: InputProps['defaultValue']
}

const LabelInput = forwardRef<HTMLInputElement, LabelInputProps>(
  ({ label, errorMessage, onFocus, onBlur, defaultValue, ...rest }, ref) => {
    const [focused, setFocused] = useState(false)

    const handleFocus: FocusEventHandler<HTMLInputElement> = (e) => {
      onFocus?.(e)
      setFocused(true)
    }
    const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
      onBlur?.(e)
      setFocused(false)
    }

    return (
      <>
        <Block>
          <Label focused={focused}>{label}</Label>
          <Input
            onFocus={handleFocus}
            onBlur={handleBlur}
            errorMessage={errorMessage}
            defaultValue={defaultValue}
            ref={ref}
            {...rest}
          />
        </Block>
      </>
    )
  },
)
LabelInput.displayName = 'LabelInput'
export default LabelInput

// Inner Components

const Block = styled.div`
  ${Flex.Container.style().direction('column').create()};
  /* 부모컴포넌트에서 gap 속성값(16px) 설정 되었으므로 불필요함 */
  // 주의: 구형브라우저 적용불가
  //& + & {
  //  margin-top: 16px;
  //}
`

const Label = styled.label<{ focused?: boolean }>`
  ${Font.style()
    .size('16px')
    .weight(600)
    .color(colors.grey4)
    .lineHeight(1.5)
    .create()};
  margin-bottom: 8px;
  transition: color 0.1s ease-in-out;

  ${(props) =>
    props.focused &&
    css`
      color: ${colors.primary1};
    `}
`
