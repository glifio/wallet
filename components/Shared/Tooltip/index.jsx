import React, { forwardRef, useState } from 'react'
import styled from 'styled-components'
import { string } from 'prop-types'
import { Text } from '../Typography'
import Box from '../Box'
import { IconClose } from '../Icons'

const TooltipContent = styled(Box)`
  position: absolute;
  display: block;
  bottom: -50%;
  top: 50%;
  height: fit-content;
  width: max-content;
  max-width: 200px;
  transform: translate(60%, -50%);
  opacity: 1;
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
  background-color: transparent;
  border-radius: ${props => props.theme.radii[6]};
  border: 1px solid;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.24s ease-in-out;


/* If we want to revert this to a hover state implementation, restore this & remove the onClick state handler */
  /* &:hover {
    ${TooltipContent} {
      opacity: 1;
    }
  } */

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
  const [active, setActive] = useState(false)
  return (
    <TooltipContainer
      onClick={() => setActive(!active)}
      aria-label='Tooltip'
      ref={ref}
      {...props}
    >
      {active ? (
        <IconClose fill='#000' width={3} />
      ) : (
        <Text m={0} color='black'>
          ?
        </Text>
      )}
      {active && (
        <TooltipContent ontouchstart display='flex' p={2} borderRadius={4}>
          <Text display='block' m={0}>
            {content}
          </Text>
        </TooltipContent>
      )}
    </TooltipContainer>
  )
})

Tooltip.propTypes = {
  content: string.isRequired
}

export default Tooltip
