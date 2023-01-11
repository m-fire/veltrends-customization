import React, {
  ReactElement,
  ReactFragment,
  ReactNode,
  ReactPortal,
} from 'react'
import FullHeightBlock from '~/common/component/element/FullHeightBlock'

export type MobileBasedLayoutProps = {
  header: ReactElement | ReactFragment | ReactPortal | null
  children?: ReactNode
  footer: ReactElement | ReactFragment | ReactPortal | null
}

/**
 * Default layout.
 * Shows content with a header.
 * Header might contain back button.
 * Header might contain title.
 */
function LayoutFullHeight({
  header,
  children,
  footer,
}: MobileBasedLayoutProps) {
  return (
    <FullHeightBlock>
      {header}
      {children}
      {footer}
    </FullHeightBlock>
  )
}
export default LayoutFullHeight

// Inner Components
