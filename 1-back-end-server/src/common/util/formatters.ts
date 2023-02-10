const HHMMSS = '00:00:00'

export const Formatters = {
  Date: {
    /**
     * <h3>Date string 문자열을 "yyyy-mm-dd hh:mm:ss" 포맷팅</h3>
     * @param yyyymmdd 2000-00-00
     * @param hhmmss 00:00:00
     */
    yyyymmdd_hhmmss(yyyymmdd: string, hhmmss = HHMMSS) {
      return new Date(`${yyyymmdd} ${hhmmss}`)
    },
  },
} as const
