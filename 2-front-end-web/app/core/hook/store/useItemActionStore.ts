import useAppStore from './useAppStore'

export function useItemStateMap() {
  return useAppStore().items.stateMap
}

export function useItemStateById(itemId: number) {
  return useItemStateMap()[itemId]
}

export function useItemStateAction() {
  return useAppStore().items
}
