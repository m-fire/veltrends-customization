import React, { FocusEventHandler, forwardRef, useState } from 'react'
import styled, { css } from 'styled-components'
import Input, { InputProps } from '~/common/component/atom/Input'
import { globalColors } from '~/common/style/global-colors'
import { Flex, Font } from '~/common/style/css-builder'

type InteractiveLabelInputProps = {
  label: string
  errorMessage?: string | null
  activeColor?: string
  errorColor?: string
  onFocus?: FocusEventHandler<HTMLInputElement>
  onBlur?: FocusEventHandler<HTMLInputElement>
  defaultValue?: InputProps['defaultValue']
} & InputProps

const InteractiveLabelInput = forwardRef<
  HTMLInputElement,
  InteractiveLabelInputProps
>(
  (
    {
      label,
      errorMessage,
      activeColor,
      errorColor,
      onFocus,
      onBlur,
      defaultValue,
      ...rest
    },
    ref,
  ) => {
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
          <StyledLabel activeColor={activeColor} focused={focused}>
            {label}
          </StyledLabel>
          <StyledInput
            onFocus={handleFocus}
            onBlur={handleBlur}
            defaultValue={defaultValue}
            ref={ref}
            {...rest}
          />
          {errorMessage ? (
            <Message errorColor={errorColor}>{errorMessage}</Message>
          ) : null}
        </Block>
      </>
    )
  },
)

export default InteractiveLabelInput

// Inner Components

const Block = styled.div`
  ${Flex.Container.style().direction('column').create()};
  /* 부모컴포넌트에서 gap 속성값(16px) 설정 되었으므로 불필요함 */
  // 주의: 구형브라우저 적용불가
  //& + & {
  //  margin-top: 16px;
  //}
`

const StyledLabel = styled.label<
  Pick<InteractiveLabelInputProps, 'activeColor'> & { focused?: boolean }
>`
  ${Font.style()
    .size('16px')
    .weight(600)
    .color(globalColors.grey4)
    .lineHeight(1.5)
    .create()};
  margin-bottom: 8px;
  transition: color 0.1s ease-in-out;

  ${({ focused, activeColor }) =>
    focused &&
    activeColor &&
    css`
      color: ${activeColor};
    `}
`

const StyledInput = styled(Input)<
  Pick<InteractiveLabelInputProps, 'activeColor'>
>`
  &:focus {
    border: 2px solid
      ${({ activeColor }) => (activeColor ? activeColor : globalColors.grey6)};
  }
`

const Message = styled.div<Pick<InteractiveLabelInputProps, 'errorColor'>>`
  ${({ errorColor }) => {
    const font = Font.style().size('14px')
    errorColor && font.color(errorColor)
    return font.create()
  }};
  margin-top: 6px;
`
