import {
  FocusEventHandler,
  forwardRef,
  TextareaHTMLAttributes,
  useState,
} from 'react'
import styled, { css } from 'styled-components'
import { colors } from '~/core/style/colors'
import { Flex, Font } from '~/common/style/css-builder'

interface LabelTextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  defaultValue?: string | number | readonly string[]
}

const LabelTextArea = forwardRef<HTMLTextAreaElement, LabelTextAreaProps>(
  (
    {
      label,
      onBlur,
      onFocus,
      className,
      defaultValue,
      ...rest
    }: LabelTextAreaProps,
    ref,
  ) => {
    const [focused, setFocused] = useState(false)
    const handleFocus: FocusEventHandler<HTMLTextAreaElement> = (e) => {
      onFocus?.(e)
      setFocused(true)
    }
    const handleBlur: FocusEventHandler<HTMLTextAreaElement> = (e) => {
      onBlur?.(e)
      setFocused(false)
    }

    return (
      <Block className={className}>
        <Label focused={focused}>{label}</Label>
        <StyledTextArea
          onFocus={handleFocus}
          onBlur={handleBlur}
          defaultValue={defaultValue}
          ref={ref}
          {...rest}
        />
      </Block>
    )
  },
)
LabelTextArea.displayName = 'LabelTextArea'
export default LabelTextArea

// Inner Components

const Block = styled.div`
  ${Flex.Container.style().direction('column').create()};
`

const Label = styled.label<{ focused?: boolean }>`
  ${Font.style()
    .size('16px')
    .weight(600)
    .color(colors.secondary1)
    .lineHeight(1.5)
    .create()};
  margin-bottom: 8px;
  transition: all 0.25s ease-in-out;
  ${({ focused }) =>
    focused &&
    css`
      color: ${colors.primary1};
    `}
`

const StyledTextArea = styled.textarea`
  ${Font.style().size('16px').color(colors.grey5).lineHeight(1.5).create()};
  border: 2px solid ${colors.grey2};
  border-radius: 4px;
  outline: none;
  padding: 16px;
  transition: all 0.25s ease-in-out;

  &:focus {
    border: 2px solid ${colors.primary1};
  }

  &::placeholder {
    color: ${colors.grey2};
  }

  &:disabled {
    background: ${colors.grey1};
    color: ${colors.grey3};
  }
`