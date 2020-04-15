import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { object } from 'prop-types'
import { layout, space, border, flexbox } from 'styled-system'
import { IconClose, IconCopyAccountAddress } from '../Icons'

const IconButtonBase = styled.button`
  outline: 0;
  border: 0;
  background: transparent;
  transition: 0.24s ease-in-out;
  cursor: pointer;

  &:hover {
   transform:scale(1.25);
  }
  ${layout}
  ${space}
  ${border}
  ${flexbox}
`

const IconButton = forwardRef(({ Icon, ...props }, ref) => (
  <IconButtonBase display='inline-block' ref={ref} {...props}>
    <Icon />
  </IconButtonBase>
))

IconButton.propTypes = {
  Icon: object
}

export const ButtonClose = ({ ...props }) => (
  <IconButton Icon={IconClose} {...props} />
)

export const ButtonCopyAccountAddress = ({ ...props }) => (
  <IconButton Icon={IconCopyAccountAddress} {...props} />
)
