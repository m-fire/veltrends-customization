import useBottomMenuModalStore from '~/common/hooks/store/useBottomMenuModalStore'
import React from 'react'
import BottomMenuModal from '~/components/system/BottomMenuModal'

type GlobalBottomMenuModalParams = {}

function GlobalBottomMenuModal({}: GlobalBottomMenuModalParams) {
  const {
    state: { items, visible },
    action: { close },
  } = useBottomMenuModalStore()

  return <BottomMenuModal items={items} visible={visible} onClose={close} />
}
export default GlobalBottomMenuModal
