export class DateCalculator {
  /**
   * 특정 Date 로 부터 현재까지의 시간 반환
   */
  static hoursFromNow(from: Date) {
    const fromNow = Date.now() - new Date(from).getTime()
    return fromNow / 1000 / 60 / 60
  }
}
