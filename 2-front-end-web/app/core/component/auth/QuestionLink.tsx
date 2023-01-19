import React from 'react'
import styled, { css } from 'styled-components'
import { Link } from '@remix-run/react'
import { globalColors } from '~/common/style/global-colors'
import { Font } from '~/common/style/css-builder'
import { RoutePath } from '~/common/api/client'

type QuestionLinkProps = {
  question: string
  name: string
  to: RoutePath
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
  ${Font.style().size(13).color(globalColors.grey3).create()};
  span {
    padding-right: 8px;
  }
  a {
    ${Font.style().size(15).weight(600).color(globalColors.grey4).create()};
    transition: color 0.25s ease-in-out;

    ${({ disabled }) =>
      disabled &&
      css`
        ${Font.presets.noneTextDecoration};
        color: ${globalColors.grey3};
        pointer-events: none;
      `};
  }
`
