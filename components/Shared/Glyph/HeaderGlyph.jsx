import React from 'react'
import { string } from 'prop-types'
import Box from '../Box'
import { IconGlif } from '../Icons'
import { Header } from '../Typography'

const HeaderGlyph = ({ alt, color, text, imageUrl, fill, imageOpacity }) => {
  return (
    <Box
      position='relative'
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
      opacity='1'
      css={`
        &:before {
          content: '';
          position: absolute;
          top: 0px;
          right: 0px;
          bottom: 0px;
          left: 0px;
          background-color: rgba(0, 0, 0, 0.25);
          background: url(${imageUrl}) center no-repeat;
          background-size: 100%;
          border-radius: 16px;
          opacity: ${imageOpacity};
          z-index: -9;
          alt: ${alt};
        }
      `}
    >
      <IconGlif
        fill={fill}
        size={7}
        css={`
          transform: rotate(-90deg);
        `}
      />
      <Header color={color} ml={3}>
        {text}
      </Header>
    </Box>
  )
}

HeaderGlyph.propTypes = {
  alt: string,
  text: string.isRequired,
  imageUrl: string.isRequired,
  imageOpacity: string.isRequired,
  color: string,
  fill: string
}

HeaderGlyph.defaultProps = {
  alt: '',
  color: 'core.black',
  fill: '#000'
}

export default HeaderGlyph
