import { createContext, useContext } from 'react'
import { User } from '~/common/api/auth'

/**
 * <h2>UserContext</h2>
 * <ol>
 *     <ul>
 *         <li>null: not logged in</li>
 *         <li>undefined: UserContext.Provider not used</li>
 *     </ul>
 * </ol>
 */
export const UserContext = createContext<User | null | undefined>(null)

export function useAuthUser() {
  const getAuthUser = useContext(UserContext)
  if (getAuthUser === undefined) {
    throw new Error('UserContext.Provider not used')
  }
  return getAuthUser
}
