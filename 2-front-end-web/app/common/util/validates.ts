export class Validates {
  static readonly Auth = class AuthenticationInfoValidation {
    static usrename = (text: string) => /^[a-z0-9]{5,20}$/.test(text)

    static password = (text: string) => {
      const passwordRules = [/[a-zA-Z]/, /[0-9]/, /[^A-Za-z0-9]/]
      if (text.length < 8) return false
      const counter = passwordRules.reduce((acc, current) => {
        if (current.test(text)) {
          acc += 1
        }
        return acc
      }, 0)
      return counter > 1
    }
  }
}
