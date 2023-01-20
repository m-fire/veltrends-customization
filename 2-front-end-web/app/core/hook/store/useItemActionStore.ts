import useAppStore from './useAppStore'

export function useItemStateMap() {
  const stateMap = useAppStore((store) => store.items.stateMap)
  return stateMap
}

export function useItemStateById(itemId: number) {
  const stateById = useItemStateMap()[itemId]
  return stateById
}

export function useItemStateAction() {
  const { setLiked, setBookmarked } = useAppStore((store) => store.items)
  return { setLiked, setBookmarked }
}
