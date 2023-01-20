import { Authenticator } from '~/core/api/auth'
import { useUserStoreAction } from '~/common/store/user'

export function useLogout() {
  const { setUser } = useUserStoreAction()
  const handleLogout = async () => {
    try {
      await Authenticator.removeAuthentication()
      setUser(null)
    } catch (e) {}
    window.location.href = '/'
  }
  return handleLogout
}
