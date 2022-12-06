import { createContext, useContext } from 'react'
import { SimpleUser } from '~/common/api/types'

/**
 * <h2>UserContext</h2>
 * <ol>
 *     <ul>
 *         <li>null: not logged in</li>
 *         <li>undefined: UserContext.Provider not used</li>
 *     </ul>
 * </ol>
 */
export const UserContext = createContext<SimpleUser | null | undefined>(null)

export function useAuthUser() {
  const getAuthUser = useContext(UserContext)
  if (getAuthUser === undefined) {
    throw new Error('UserContext.Provider not used')
  }
  return getAuthUser
}
