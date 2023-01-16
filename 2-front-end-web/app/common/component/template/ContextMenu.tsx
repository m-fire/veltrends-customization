import React, { ReactNode, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import styled from 'styled-components'
import {
  ClickAndTouchEvent,
  useOnClickOutside,
} from '~/common/hook/useOnClickOutside'

export type ContextMenuProps = {
  visible: boolean
  onClose: (event?: ClickAndTouchEvent) => void
  children?: ReactNode
}

function ContextMenu({ visible, onClose, children }: ContextMenuProps) {
  //
  const ref = useRef<HTMLDivElement>(null)
  useOnClickOutside(ref, (e) => {
    if (!visible) return
    onClose(e)
  })

  return (
    <AnimatePresence initial={false}>
      {visible ? (
        <MenuItemContainer
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.125 }}
          onClick={() => onClose()}
          ref={ref}
        >
          <Triangle />
          <TriangleBorder />

          {children}
        </MenuItemContainer>
      ) : null}
    </AnimatePresence>
  )
}
export default ContextMenu

// Inner Components

const MenuItemContainer = styled(motion.div)`
  position: absolute;
  right: 0px;
  top: 48px;
  min-width: 130px;
  border-radius: 6px;
  background: white;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.15);
`

// 물음박스의 방향표시용 삼각형
const Triangle = styled.div`
  position: absolute;
  right: 16px;
  top: -8px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid white;
  z-index: 2;
`

// 메뉴블럭
const TriangleBorder = styled.div`
  position: absolute;
  right: 14px;
  top: -10px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #e0e0e0;
  z-index: 1;
`
