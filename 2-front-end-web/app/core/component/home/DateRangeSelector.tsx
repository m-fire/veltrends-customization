import { useEffect, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { format } from 'date-fns'
import { Link } from '@remix-run/react'
import { colors } from '~/common/style/colors'
import {
  DateStringRange,
  WeekRangeConverters as wrc,
  YYYY_MM_DD,
} from '~/common/util/converters'
import { flexStyles } from '~/common/style/styled'
import { ArrowLeft } from '~/core/component/generate/svg'

const SERVICE_START_DATE = new Date('2022-09-01')
const yy년MM월dd일 = 'yy년 MM월 dd일' as const

interface DateRangeSelectorProps {
  baseLinkTo: string
  dateRange: DateStringRange
}

function DateRangeSelector({ baseLinkTo, dateRange }: DateRangeSelectorProps) {
  const [startDate, endDate] = useMemoFormattedRange(dateRange, yy년MM월dd일)
  const [rangeLink, setRangeLink] = useState(
    createRangeLink({ baseLinkTo, dateRange }),
  )
  const [prevDisabled, nextDisabled] = useMemoDisableFlags(dateRange)

  useEffect(() => {
    setRangeLink(createRangeLink({ baseLinkTo, dateRange }))
  }, [dateRange])

  return (
    <Block>
      <WeekNavigator>
        <StyledLink
          to={rangeLink.prevTo}
          direction="left"
          disabled={prevDisabled}
        >
          {startDate} <ArrowLeft />
        </StyledLink>
        <StyledLink
          to={rangeLink.nextTo}
          direction="right"
          disabled={nextDisabled}
        >
          <ArrowLeft /> {endDate}
        </StyledLink>
      </WeekNavigator>
    </Block>
  )

  /* refactor */

  function useMemoFormattedRange(range: DateStringRange, dateFormat: string) {
    return useMemo(() => {
      return [
        format(new Date(range.start), dateFormat),
        format(new Date(range.end), dateFormat),
      ]
    }, [range])
  }

  function useMemoDisableFlags(range: DateStringRange) {
    return useMemo(() => {
      const today = new Date(format(Date.now(), YYYY_MM_DD))
      const { start, end } = wrc.toRangeDate(range)
      const prevDisabled = start <= SERVICE_START_DATE
      const nextDisabled = end >= today
      return [prevDisabled, nextDisabled]
    }, [range])
  }

  function createRangeLink({
    baseLinkTo,
    dateRange,
  }: Pick<DateRangeSelectorProps, 'baseLinkTo' | 'dateRange'>) {
    const prevRange = wrc.minusWeeks(dateRange)
    const nextRange = wrc.plusWeeks(dateRange)
    return {
      prevTo: rangeLinkTo({ baseLinkTo, ...prevRange }),
      nextTo: rangeLinkTo({ baseLinkTo, ...nextRange }),
    }
  }

  function rangeLinkTo({ baseLinkTo, start, end }: GetNextLinkParams) {
    return `${baseLinkTo}&start=${start}&end=${end}`
  }
  type GetNextLinkParams = {
    baseLinkTo: string
    start: string
    end: string
  }
}
export default DateRangeSelector

// Inner Components

const WeekNavigator = styled.div`
  ${flexStyles({ justifyContent: 'center' })}
  margin-top: -12px;
  margin-bottom: 12px;
  gap: 32px;
`

const StyledLink = styled(Link)<{
  direction: 'left' | 'right'
  disabled: boolean
}>`
  ${flexStyles({ alignItems: 'center', justifyContent: 'center' })}
  color: ${colors.primary1};
  font-size: inherit;
  text-decoration: none;
  gap: 8px;
  ${({ disabled }) =>
    disabled &&
    css`
      color: ${colors.grey2};
      text-decoration: none;
      pointer-events: none;
    `};
  svg {
    height: 12px;
    ${({ direction }) =>
      direction === 'right' &&
      css`
        transform: rotate(180deg);
      `}
  }
`

const Block = styled.div`
  font-size: 16px;
  margin-bottom: 16px;
  color: ${colors.grey5};
`