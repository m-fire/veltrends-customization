import React from 'react'
import styled from 'styled-components'
import { Link } from '@remix-run/react'
import { colors } from '~/common/style/colors'

type QuestionLinkProps = {
  question: string
  name: string
  to: string
  className?: string
}

function QuestionLink({ question, name, to, className }: QuestionLinkProps) {
  return (
    <Block className={className}>
      <span>{question}</span> <Link to={to}>{name}</Link>
    </Block>
  )
}
export default QuestionLink

// Inner Components

const Block = styled.div`
  font-size: 12px;
  color: ${colors.grey3};
  span {
    padding-right: 8px;
  }
  a {
    font-size: 16px;
    font-weight: 600;
    color: ${colors.grey5};
  }
`
