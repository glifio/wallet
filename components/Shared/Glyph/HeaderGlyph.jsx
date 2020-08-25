import React from 'react'
import { string } from 'prop-types'
import { MenuItem } from '../Menu'
import Box from '../Box'
import { IconGlif } from '../Icons'
import { Header } from '../Typography'

const HeaderGlyph = ({ alt, color, text, imageUrl }) => {
  return (
    <MenuItem display='flex' alignItems='center' width={['100%', 'auto']}>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        py={2}
        mr={[0, 6]}
        mb={[3, 0]}
        px={3}
        borderRadius={4}
        width={['100%', 'auto']}
        height='120px'
        css={`
          background: url(${imageUrl}) center no-repeat;
          background-size: 100%;
          border-radius: 16px;
          alt: ${alt};
        `}
      >
        <IconGlif
          fill='#fff'
          size={7}
          css={`
            transform: rotate(-90deg);
          `}
        />
        <Header color={color} ml={3}>
          {text}
        </Header>
      </Box>
    </MenuItem>
  )
}

HeaderGlyph.propTypes = {
  alt: string,
  text: string.isRequired,
  imageUrl: string.isRequired,
  alt: string
}

HeaderGlyph.defaultProps = {
  alt: '',
  color: 'core.black'
}

export default HeaderGlyph
