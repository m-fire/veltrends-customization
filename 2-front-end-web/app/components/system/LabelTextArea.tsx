import {
  FocusEventHandler,
  forwardRef,
  TextareaHTMLAttributes,
  useState,
} from 'react'
import styled, { css } from 'styled-components'
import { colors } from '~/common/style/colors'

interface LabelTextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
}

const LabelTextArea = forwardRef<HTMLTextAreaElement, LabelTextAreaProps>(
  ({ label, onBlur, onFocus, className, ...rest }: LabelTextAreaProps, ref) => {
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
          {...rest}
          ref={ref}
        />
      </Block>
    )
  },
)
LabelTextArea.displayName = 'LabelTextArea'
export default LabelTextArea

// Inner Components

const Block = styled.div`
  display: flex;
  flex-direction: column;
`

const Label = styled.label<{ focused?: boolean }>`
  font-size: 16px;
  line-height: 1.5;
  color: ${colors.grey4};
  font-weight: 600;
  margin-bottom: 8px;
  transition: all 0.25s ease-in-out;
  ${({ focused }) =>
    focused &&
    css`
      color: ${colors.primary1};
    `}
`

const StyledTextArea = styled.textarea`
  border: 1px solid ${colors.grey2};
  border-radius: 4px;
  outline: none;
  font-size: 16px;
  padding: 16px;
  line-height: 1.5;
  color: ${colors.grey5};
  transition: all 0.25s ease-in-out;

  &:focus {
    border: 1px solid ${colors.primary1};
  }

  &::placeholder {
    color: ${colors.grey2};
  }

  &:disabled {
    background: ${colors.grey1};
    color: ${colors.grey3};
  }
`
