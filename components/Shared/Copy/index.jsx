import React, { forwardRef, useState } from 'react'
import styled from 'styled-components'
import { string } from 'prop-types'
import Box from '../Box'
import BaseButton from '../Button/BaseButton'
import { IconCopyAccountAddress } from '../Icons'
import { Label, Title as AccountAddress } from '../Typography'
import truncate from '../../../utils/truncateAddress'
import copyToClipboard from '../../../utils/copyToClipboard'
import { ADDRESS_PROPTYPE } from '../../../customPropTypes'

const Copy = styled(BaseButton)`
  /* !important is declared here to override BaseButton's opacity:0.8 on hover. The only instance of us using this declaration. */
  height: auto;
  opacity: 1 !important;
  border: 0;
  background: transparent;
  padding: 0;
  outline: none;
`

const StyledIconCopyAccountAddress = styled(IconCopyAccountAddress)`
  transition: 0.24s ease-in-out;
  ${Copy}:hover & {
    transform: scale(1.25);
  }
`

const LabelCopy = styled(Label)`
  transition: 0.18s ease-in;
  opacity: 0;
  ${Copy}:hover & {
    opacity: 1;
  }
`

export const CopyAddress = forwardRef(({ address, ...props }, ref) => {
  const [copied, setCopied] = useState(false)
  return (
    <Box ref={ref} display='flex' alignItems='center' {...props}>
      <AccountAddress
        fontWeight={1}
        fontSize={3}
        margin={0}
        overflow='hidden'
        whiteSpace='nowrap'
      >
        {truncate(address)}
      </AccountAddress>
      <Copy
        display='flex'
        alignItems='center'
        ml={2}
        onClick={() => {
          setCopied(true)
          copyToClipboard(address)
        }}
      >
        <StyledIconCopyAccountAddress />
        <LabelCopy
          mt={0}
          ml={1}
          minWidth={7}
          textAlign='left'
          color={props.color}
        >
          {copied ? 'Copied' : 'Copy'}
        </LabelCopy>
      </Copy>
    </Box>
  )
})

CopyAddress.propTypes = {
  address: ADDRESS_PROPTYPE,
  color: string
}

CopyAddress.defaultProps = {
  color: 'core.secondary'
}
