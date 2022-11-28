import React from 'react'
import styled from 'styled-components'
import { AnimatePresence, motion } from 'framer-motion'
import { colors } from '~/common/style/colors'
import Overlay from '~/components/system/Overlay'
import { flexStyles, fontStyles } from '~/common/style/styled'
import { BottomMenuModalStore } from '~/common/hooks/store/useBottomMenuModalStore'

/* BottomMenuModal */

type BottomMenuModalProps = {
  items: BottomMenuModalStore['state']['items']
  visible: BottomMenuModalStore['state']['visible']
  onClose(): void
}

function BottomMenuModal({ visible, items, onClose }: BottomMenuModalProps) {
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
export default BottomMenuModal

/* BottomMenuModalBase */

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
  ${flexStyles({ direction: 'column' })};
`

const Item = styled.div`
  ${fontStyles({ weight: 600, color: colors.grey5 })}
  padding: 16px;
`
