/**
 * username should be 5~20 alphanumeric characters.
 * 사용자 이름은 5~20자의 영숫자여야 합니다.
 */
export function checkValidUsername(username: string) {
  return /^[a-z0-9]{5,20}$/.test(username)
}

/**
 * should be more than or equal to 8 letters and contains at least two types of alphabet, number, special character.
 * 8자 이상이어야 하며 알파벳, 숫자, 특수문자 중 2가지 이상을 포함해야 합니다.
 */
export function checkValidPassword(password: string) {
  const passwordRules = [/[a-zA-Z]/, /[0-9]/, /[^A-Za-z0-9]/]
  if (password.length < 8) return false
  const counter = passwordRules.reduce((acc, current) => {
    if (current.test(password)) {
      acc += 1
    }
    return acc
  }, 0)
  return counter > 1
}
