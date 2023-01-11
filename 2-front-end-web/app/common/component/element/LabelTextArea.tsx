import {
  FocusEventHandler,
  forwardRef,
  TextareaHTMLAttributes,
  useState,
} from 'react'
import styled, { css } from 'styled-components'
import { globalColors } from '~/common/style/global-colors'
import { appColors } from '~/core/style/app-colors'
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

export default LabelTextArea

// Inner Components

const Block = styled.div`
  ${Flex.Container.style().direction('column').create()};
`

const Label = styled.label<{ focused?: boolean }>`
  ${Font.style()
    .size('16px')
    .weight(600)
    .color(appColors.secondary1)
    .lineHeight(1.5)
    .create()};
  margin-bottom: 8px;
  transition: all 0.25s ease-in-out;
  ${({ focused }) =>
    focused &&
    css`
      color: ${appColors.primary1};
    `}
`

const StyledTextArea = styled.textarea`
  ${Font.style()
    .size('16px')
    .color(globalColors.grey5)
    .lineHeight(1.5)
    .create()};
  border: 2px solid ${globalColors.grey2};
  border-radius: 4px;
  outline: none;
  padding: 16px;
  transition: all 0.25s ease-in-out;

  &:focus {
    border: 2px solid ${appColors.primary1};
  }

  &::placeholder {
    color: ${globalColors.grey2};
  }

  &:disabled {
    background: ${globalColors.grey1};
    color: ${globalColors.grey3};
  }
`
