'use client'

import { forwardRef } from 'react'

interface IconProps {
  icon: string
  className?: string
  fontSize?: number | string
  color?: string
  style?: React.CSSProperties
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
}

// This component renders Iconify icons
const Icon = forwardRef<HTMLElement, IconProps>((props, ref) => {
  const { icon, className, fontSize = 24, color, style, onClick, ...rest } = props

  // Iconify icon classes are prefixed with 'ri-' or 'mdi-'
  const getClass = () => {
    if (icon.startsWith('ri-')) return icon
    if (icon.startsWith('mdi:')) return `mdi ${icon.replace('mdi:', 'mdi-')}`
    
    return icon
  }

  
  return (
    <i
      ref={ref}
      className={`${getClass()} ${className || ''}`}
      style={{
        fontSize,
        color,
        ...style
      }}
      onClick={onClick}
      {...rest}
    />
  )
})

Icon.displayName = 'Icon'

export default Icon
