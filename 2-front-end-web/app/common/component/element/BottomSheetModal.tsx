import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { AnimatePresence, motion } from 'framer-motion'
import { globalColors } from '~/common/style/global-colors'
import { BottomSheetModalStore } from '~/common/hook/store/useBottomSheetModalStore'
import { Flex, Font } from '~/common/style/css-builder'
import Overlay from '~/common/component/atom/Overlay'

type BottomSheetModalProps = {
  overlay?: ReactNode
  items: BottomSheetModalStore['state']['items']
  visible: BottomSheetModalStore['state']['visible']
  onClose(): void
}

function BottomSheetModal({
  overlay,
  visible,
  items,
  onClose,
}: BottomSheetModalProps) {
  return (
    <>
      {overlay ?? <Overlay onClick={onClose} visible={visible} />}
      <AnimatePresence>
        {visible && (
          <Sheet
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{
              damping: 0,
            }}
          >
            <Items onClick={onClose}>
              {items.map((item) => (
                <Item key={item.name} onClick={item.onClick}>
                  {item.name}
                </Item>
              ))}
            </Items>
          </Sheet>
        )}
      </AnimatePresence>
    </>
  )
}
export default BottomSheetModal

// Inner Components

const Sheet = styled(motion.div)`
  position: fixed;
  background: white;
  bottom: 0;
  left: 0;
  width: 100%;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`

const Items = styled.div`
  ${Flex.container().direction('column').create()};
`

const Item = styled.div`
  ${Font.style().weight(600).color(globalColors.grey5).create()};
  padding: 16px;
`
