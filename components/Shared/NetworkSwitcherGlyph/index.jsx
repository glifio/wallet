import React from 'react'
import styled from 'styled-components'
import { bool, func } from 'prop-types'
import Box from '../Box'

const GlyphButton = styled.input.attrs(props => ({
  display: 'inline-block',
  height: props.height || 7,
  width: props.width || 7
}))`
  background: ${props => {
    if (props.connected && props.active)
      return props.theme.colors.status.success.background
    if (props.error) return props.theme.colors.status.error.background
    return props.theme.colors.core.transparent
  }};
`

const NetworkSwitcherGlyph = (
  { active, connected, onClick, ...props },
  ref
) => {
  return (
    <Box display='flex' ref={ref} {...props}>
      <GlyphButton onClick={onClick}>Tn</GlyphButton>
      <GlyphButton onClick={onClick}>Mn</GlyphButton>
    </Box>
  )
}

GlyphButton.propTypes = {
  /**
   * Is the network active?
   */
  active: bool.isRequired,
  /**
   * Is the user connected to the network?
   */
  connected: bool.isRequired,
  onClick: func.isRequired
}

GlyphButton.defaultProps = {
  active: true,
  connected: true
}

export default NetworkSwitcherGlyph
