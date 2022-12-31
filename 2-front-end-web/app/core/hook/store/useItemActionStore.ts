import useAppActionStore from '~/core/hook/store/useAppActionStore'

export function useItemStateMap() {
  const stateMap = useAppActionStore((store) => store.items.stateMap)
  return stateMap
}

export function useItemStateById(itemId: number) {
  const stateById = useItemStateMap()[itemId]
  return stateById
}

export function useItemStateActions() {
  const itemStateMapActions = useAppActionStore(
    (store) => store.items.stateActions,
  )
  return itemStateMapActions
}
