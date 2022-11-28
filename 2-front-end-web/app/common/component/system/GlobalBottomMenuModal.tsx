import useBottomMenuModalStore from '~/common/hook/store/useBottomMenuModalStore'
import React from 'react'
import BottomMenuModal from '~/common/component/system/BottomMenuModal'

type GlobalBottomMenuModalParams = {}

function GlobalBottomMenuModal({}: GlobalBottomMenuModalParams) {
  const {
    state: { items, visible },
    action: { close },
  } = useBottomMenuModalStore()

  return <BottomMenuModal items={items} visible={visible} onClose={close} />
}
export default GlobalBottomMenuModal
