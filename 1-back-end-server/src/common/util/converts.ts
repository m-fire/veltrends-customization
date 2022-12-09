const HHMMSS = '00:00:00'

export class Converts {
  static Date = class DateFormatter {
    static newYyyymmddHhmmss(yyyymmdd: string, hhmmss = HHMMSS) {
      return new Date(`${yyyymmdd} ${hhmmss}`)
    }
  }
}
