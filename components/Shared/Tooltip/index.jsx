import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { string } from 'prop-types'
import { Text } from '../Typography'
import Box from '../Box'

const TooltipContent = styled(Box)`
  position: absolute;
  display: block;
  bottom: -50%;
  top: 50%;
  /* left: 50%; */
  height: fit-content;
  max-width: 240px;
  transform: translate(60%, -50%);
  opacity: 0;
  padding: ${props => props.theme.sizes[2]}px;

  background-color: ${props => props.theme.colors.core.white};
  border-radius: ${props => props.theme.radii[2]};
  box-shadow: ${props => props.theme.shadows[2]};
  z-index: ${props => props.theme.zIndices[4]};
  transition: 0.24s ease-in-out;
`

const TooltipContainer = styled.a`
  position: relative;
  display: flex;
  background-color: ${props => props.theme.colors.core.white};
  border-radius: ${props => props.theme.radii[6]};
  border: 1px solid;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.24s ease-in-out;

  &:hover {
    ${TooltipContent} {
      opacity: 1;
    }
  }

  &:active {
    ${TooltipContent} {
      opacity: 1;
    }
  }
`

const Tooltip = forwardRef(({ content, ...props }, ref) => (
  <TooltipContainer ref={ref} {...props}>
    <Text m={0} color='black'>
      ?
    </Text>
    <TooltipContent display='flex' p={2} borderRadius={4}>
      <Text display='block' m={0}>
        {content}
      </Text>
    </TooltipContent>
  </TooltipContainer>
))

Tooltip.propTypes = {
  content: string.isRequired
}

export default Tooltip
