import React, { JSXElementConstructor } from 'react'
import styled from 'styled-components'
import { AnimatePresence, motion } from 'framer-motion'
import { globalColors } from '~/common/style/global-colors'
import AppOverlay from '~/core/component/atom/AppOverlay'
import { BottomSheetModalStore } from '~/common/hook/store/useBottomSheetModalStore'
import { Flex, Font } from '~/common/style/css-builder'
import { OverlayProps } from '~/common/component/atom/Overlay'

type BottomSheetModalProps = {
  overlay: JSXElementConstructor<OverlayProps>
  items: BottomSheetModalStore['state']['items']
  visible: BottomSheetModalStore['state']['visible']
  onClose(): void
}

function BottomSheetModal({
  overlay: Overlay,
  visible,
  items,
  onClose,
}: BottomSheetModalProps) {
  return (
    <>
      {visible ? <Overlay onClick={onClose} /> : null}
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
  ${Font.style().weight(600).color(globalColors.grey5).create()};
  padding: 16px;
`
