import useBottomSheetModalStore from '~/common/hook/store/useBottomSheetModalStore'
import React from 'react'
import BottomSheetModal from '~/common/component/system/BottomSheetModal'

type GlobalBottomSheetModalParams = {}

function GlobalBottomSheetModal({}: GlobalBottomSheetModalParams) {
  const {
    state: { items, visible },
    action: { close },
  } = useBottomSheetModalStore()

  return <BottomSheetModal items={items} visible={visible} onClose={close} />
}
export default GlobalBottomSheetModal
