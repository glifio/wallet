import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { string, object } from 'prop-types'
import { baseColors } from '../theme'
import Box from '../Box'

const GlyphText = styled.h3`
  font-family: ${props => props.theme.fonts.AliasMedium};
  font-weight: 700;
  font-size: ${props => props.theme.fontSizes[4]};
`

const Glyph = forwardRef(
  ({ acronym, Icon, color, backgroundColor, ...props }, ref) => (
    <Box
      display='flex'
      alignItems='center'
      justifyContent='center'
      size={6}
      borderWidth='0.1875rem'
      borderRadius={3}
      borderStyle={0}
      backgroundColor={backgroundColor}
      color={color}
      ref={ref}
      {...props}
    >
      {acronym ? <GlyphText>{acronym}</GlyphText> : <Icon />}
    </Box>
  )
)

Glyph.propTypes = {
  /**
   * The two letters displayed in the glyph
   */
  acronym: string,
  /**
   * This is a dom element, but PropTypes.node was failing
   */
  Icon: object,
  /**
   * The color of the text and border
   */
  color: string,
  backgroundColor: string
}

Glyph.defaultProps = {
  color: baseColors.mono.black,
  acronym: ''
}

export default Glyph
