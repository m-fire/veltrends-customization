import { Authenticator } from '~/core/api/auth'

export function useLogout() {
  const handleLogout = async () => {
    try {
      await Authenticator.logout()
    } catch (e) {}
    window.location.href = '/'
  }
  return handleLogout
}
