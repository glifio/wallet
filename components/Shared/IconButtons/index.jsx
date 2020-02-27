import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { func, object } from 'prop-types'
import { layout, space, border } from 'styled-system'
import { IconClose, IconCopyAccountAddress } from '../Icons'

const IconButtonBase = styled.button`
  outline: 0;
  border: 0;
  background: transparent;
  /* @alex todo: setup custom bezier curve anims in theme file */
  transition: 0.24s ease-in-out;
  cursor: pointer;

  &:hover {
   transform:scale(1.25);
  }
  ${layout}
  ${space}
  ${border}
`

const IconButton = forwardRef(({ onClick, Icon, ...props }, ref) => (
  <IconButtonBase display='inline-block' onClick={onClick} ref={ref} {...props}>
    <Icon />
  </IconButtonBase>
))

const ButtonClosePropTypes = {
  onClick: func.isRequired,
  Icon: object
}

IconButton.propTypes = ButtonClosePropTypes

export const ButtonClose = () => <IconButton Icon={IconClose} />

export const ButtonCopyAccountAddress = () => (
  <IconButton Icon={IconCopyAccountAddress} />
)
