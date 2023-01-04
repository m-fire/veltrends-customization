import React from 'react'
import styled, { css } from 'styled-components'
import { Link } from '@remix-run/react'
import { colors } from '~/common/style/colors'
import Font from '~/common/style/css-font'

type QuestionLinkProps = {
  question: string
  name: string
  to: string
  className?: string
  disabled?: boolean
}

function QuestionLink({
  question,
  name,
  to,
  className,
  disabled,
}: QuestionLinkProps) {
  return (
    <Block className={className} disabled={disabled}>
      <span>{question}</span>
      <Link to={to}>{name}</Link>
    </Block>
  )
}
export default QuestionLink

// Inner Components

const Block = styled.div<Pick<QuestionLinkProps, 'disabled'>>`
  ${Font.style().size('12px').color(colors.grey3).create()};
  span {
    padding-right: 8px;
  }
  a {
    ${Font.style().size('14px').weight(600).color(colors.grey5).create()};
    transition: color 0.25s ease-in-out;

    ${({ disabled }) =>
      disabled &&
      css`
        color: ${colors.grey3};
        pointer-events: none;
        text-decoration: none;
      `};
  }
`
