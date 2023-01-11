import useBottomSheetModalStore from '~/common/hook/store/useBottomSheetModalStore'
import React from 'react'
import BottomSheetModal from '~/common/component/element/BottomSheetModal'
import AppOverlay from '~/core/component/AppOverlay'

type GlobalBottomSheetModalParams = {}

function AppBottomSheetModal({}: GlobalBottomSheetModalParams) {
  const {
    state: { items, visible },
    action: { close },
  } = useBottomSheetModalStore()

  return (
    <BottomSheetModal
      overlay={AppOverlay}
      items={items}
      visible={visible}
      onClose={close}
    />
  )
}
export default AppBottomSheetModal
