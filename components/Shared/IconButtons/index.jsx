import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { func } from 'prop-types'
import Button from '../Button'
import { IconClose } from '../Icons'

const IconButton = styled(Button)`
  &:hover {
    opacity: 0.5;
  }
`

const ButtonClose = forwardRef(({ onClick, ...props }, ref) => (
  <IconButton
    display='inline-block'
    borderRadius={100}
    onClick={onClick}
    ref={ref}
    {...props}
  >
    <IconClose />
  </IconButton>
))

const ButtonClosePropTypes = {
  onClick: func.isRequired
}

ButtonClose.propTypes = ButtonClosePropTypes

export default ButtonClose
