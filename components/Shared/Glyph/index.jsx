import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { string } from 'prop-types'
import colors from '../colors'
import Box from '../Box'

const GlyphText = styled.h3`
  font-family: ${props => props.theme.fonts.AliasMedium};
  font-weight: 700;
  font-size: ${props => props.theme.fontSizes[4]};
`

const Glyph = forwardRef(
  ({ acronym, color, backgroundColor, ...props }, ref) => (
    <Box
      display='flex'
      alignItems='center'
      justifyContent='center'
      size={6}
      borderWidth='0.1875rem'
      borderStyle={0}
      backgroundColor={backgroundColor}
      color={color}
      ref={ref}
      {...props}
    >
      <GlyphText>{acronym}</GlyphText>
    </Box>
  )
)

Glyph.propTypes = {
  /**
   * The two letters displayed in the glyph
   */
  acronym: string.isRequired,
  /**
   * The color of the text and border
   */
  color: string,
  backgroundColor: string
}

Glyph.defaultProps = {
  color: colors.purplelight
}

export default Glyph
