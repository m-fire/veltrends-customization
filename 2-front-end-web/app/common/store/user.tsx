import React from 'react'
import create, { StoreApi } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { UserInfo } from '~/common/api/types'
import createContext from 'zustand/context'

export interface UserStore {
  state: {
    user: UserInfo | null
  }
  setUser(userOrNull: { id: number; username: string } | null): void
}

const initialUserStore = create(
  // devtools(
  // persist(
  immer<UserStore>((set, get) => ({
    state: {
      user: null,
    },
    setUser(userOrNull) {
      set((s) => {
        s.state.user = userOrNull
      })
    },
  })),

  //   {
  //     name: 'veltrend-user',
  //     // partialize 을 통해 localStorage 에 저장할 state 를 지정합니다.
  //     partialize: (s) => null /* 모든 state 제외설정 */,
  //   },
  // ),
  //   { name: 'veltrend-user' },
  // ),
)

type OmittedAuthStore = Omit<UserStore, 'state'>

export function getUserStoreCreator(
  initialize?: (stateSetters: OmittedAuthStore) => void,
) {
  initialize?.(getStateSetters(initialUserStore()))
  return () => initialUserStore
}

// State Provider

export const UserContext = createContext<StoreApi<UserStore>>()

// hooks

export function useUserState() {
  const userState = UserContext.useStore((s) => s.state)
  return userState
}

export function useUserStoreAction() {
  return getStateSetters(UserContext.useStore())
}

// utils

function getStateSetters(store: UserStore) {
  return Object.entries(store).reduce((acc, [k, v]) => {
    if (k === 'state') return acc
    acc[k as keyof OmittedAuthStore] = v
    return acc
  }, {} as OmittedAuthStore)
}
