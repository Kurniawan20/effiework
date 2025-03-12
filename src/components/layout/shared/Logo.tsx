'use client'

// React Imports
import type { CSSProperties } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { Box } from '@mui/material'

// Config Imports
import themeConfig from '@configs/themeConfig'

const Logo = ({ color }: { color?: CSSProperties['color'] }) => {
  return (
    <Link href={themeConfig.homePageUrl}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          '&:hover': { textDecoration: 'none' }
        }}
      >
        <Image
          src='/images/logo-effiework.png'
          alt='EffieWork AMS'
          width={160}
          height={50}
          style={{
            objectFit: 'contain'
          }}
          priority
        />
      </Box>
    </Link>
  )
}

export default Logo
