const HHMMSS = '00:00:00'

export const Formatters = {
  Date: {
    /**
     * <h3>Date string 문자열을 "yyyy-mm-dd hh:mm:ss" 포맷팅</h3>
     * @param yyyymmdd 연-월-일
     * @param hhmmss 시:분:초
     */
    yyyymmdd_hhmmss(yyyymmdd: string, hhmmss = HHMMSS) {
      return new Date(`${yyyymmdd} ${hhmmss}`)
    },
  },
} as const
