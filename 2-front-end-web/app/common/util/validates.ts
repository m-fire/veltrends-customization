export class Validates {
  static readonly Auth = class AuthenticationInfoValidation {
    static usrename = (text: string) => /^[a-z0-9]{5,20}$/.test(text)

    static password = (text: string) => {
      if (text.length < 8) return false
      const correctCount = [/[a-zA-Z]/, /[0-9]/, /[^A-Za-z0-9]/].reduce(
        (acc, rule) => {
          if (rule.test(text)) {
            acc += 1
          }
          return acc
        },
        0,
      )
      return correctCount > 1
    }
  }
}
