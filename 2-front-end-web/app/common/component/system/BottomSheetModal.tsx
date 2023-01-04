import React from 'react'
import styled from 'styled-components'
import { AnimatePresence, motion } from 'framer-motion'
import { colors } from '~/common/style/colors'
import Overlay from '~/common/component/system/Overlay'
import { BottomSheetModalStore } from '~/common/hook/store/useBottomSheetModalStore'
import Flex from '~/common/style/css-flex'
import Font from '~/common/style/css-font'

type BottomSheetModalProps = {
  items: BottomSheetModalStore['state']['items']
  visible: BottomSheetModalStore['state']['visible']
  onClose(): void
}

function BottomSheetModal({ visible, items, onClose }: BottomSheetModalProps) {
  return (
    <>
      <Overlay visible={visible} onClick={onClose} />
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
  z-index: 15;
`

const Items = styled.div`
  ${Flex.Container.style().direction('column').create()};
`

const Item = styled.div`
  ${Font.style().weight(600).color(colors.grey5).create()};
  padding: 16px;
`
