import { createContext, ReactNode, useContext, useMemo, useState } from 'react'
import { ItemStatus } from '~/common/api/types'

interface ItemOverrideProviderProps {
  children: ReactNode
}

const ItemOverrideContext = createContext<ItemOverrideContextType | null>(null)

export function ItemOverrideProvider({ children }: ItemOverrideProviderProps) {
  const [state, setState] = useState<ItemOverrideContextState>({})

  const actions: ItemOverrideContextActions = useMemo(
    () => ({
      set(itemId, overridableItem) {
        setState((prev) => ({
          ...prev,
          [itemId]: overridableItem,
        }))
      },
    }),
    [],
  )

  return (
    <ItemOverrideContext.Provider value={{ state, actions }}>
      {children}
    </ItemOverrideContext.Provider>
  )
}

export function useItemOverride() {
  const context = useContext(ItemOverrideContext)
  if (context === null) {
    throw new Error('ItemOverrideContext.Provider not used')
  }
  return context
}

export function useItemOverrideById(
  itemId: number,
): OverridableItem | undefined {
  const { state } = useItemOverride()
  return state[itemId]
}

// types

interface ItemOverrideContextType {
  state: ItemOverrideContextState
  actions: ItemOverrideContextActions
}

interface ItemOverrideContextState {
  [key: number]: OverridableItem
}

interface OverridableItem {
  itemStatus: ItemStatus
  isLiked: boolean
}

interface ItemOverrideContextActions {
  set(itemId: number, overridableItem: OverridableItem): void
}
