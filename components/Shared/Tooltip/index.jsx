import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { color, border } from 'styled-system'
import { string } from 'prop-types'
import { Text } from '../Typography'
import Box from '../Box'

const TooltipContent = styled(Box)`
  position: absolute;
  display: none;
  height: fit-content;
  width: max-content;
  max-width: 200px;
  left: 50%;
  transform: translateX(-50%);
  bottom: -48px;
  padding: ${props => props.theme.sizes[2]}px;
  color: ${props => props.theme.colors.core.nearblack};
  background-color: ${props => props.theme.colors.core.white};
  border-radius: ${props => props.theme.radii[2]};
  box-shadow: ${props => props.theme.shadows[2]};
  z-index: ${props => props.theme.zIndices[1]};
  transition: 0.24s ease-in-out;
  ${color}
`

const TooltipContainer = styled.a`
  position: relative;
  display: flex;
  background-color: transparent;
  border-radius: ${props => props.theme.radii[6]};
  border: 1px solid;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.24s ease-in-out;
  ${color}
  ${border}

 &:hover ~ ${TooltipContent} {
      display: block;
  }

  /* Paired with the ontouchstart declaration inside the TooltipContent markup, this is intended to enable touch devices to trigger the tooltip, too. While we don't support touch devices at launch, we may do so in the future. Ref: https://stackoverflow.com/a/37150472/2839730 */

  /* &:active {
    ${TooltipContent} {
      opacity: 1;
    }
  }

  &:focus {
    ${TooltipContent} {
      opacity: 1;
    }
  } */
`

const Tooltip = forwardRef(({ content, ...props }, ref) => {
  return (
    <Box position='relative' mx={2}>
      <TooltipContainer aria-label='Tooltip' ref={ref} {...props}>
        <Text m={0} color='core.black'>
          ?
        </Text>
      </TooltipContainer>

      <TooltipContent ontouchstart p={2} borderRadius={4}>
        <Text textAlign='left' display='block' m={0}>
          {content}
        </Text>
      </TooltipContent>
    </Box>
  )
})

Tooltip.propTypes = {
  content: string.isRequired
}

export default Tooltip
