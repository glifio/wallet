import React, { forwardRef, useState } from 'react'
import styled from 'styled-components'
import Box from '../Box'
import BaseButton from '../Button/BaseButton'
import { IconCopyAccountAddress } from '../Icons'
import { Label, Title as AccountAddress } from '../Typography'
import truncate from '../../../utils/truncateAddress'
import copyToClipboard from '../../../utils/copyToClipboard'
import { ADDRESS_PROPTYPE } from '../../../customPropTypes'

export const Copy = styled(BaseButton)`
  /* !important is declared here to override BaseButton's opacity:0.8 on hover. The only instance of us using this declaration. */
  opacity: 1 !important;
  border: 0;
  background: transparent;
  padding: 0;
  outline: none;
`

export const StyledIconCopyAccountAddress = styled(IconCopyAccountAddress)`
  transition: 0.24s ease-in-out;
  ${Copy}:hover & {
    transform: scale(1.25);
  }
`

export const LabelCopy = styled(Label)`
  transition: 0.18s ease-in;
  opacity: 0;
  ${Copy}:hover & {
    opacity: 1;
  }
`

export const CopyAddress = forwardRef(({ address, ...props }, ref) => {
  const [copied, setCopied] = useState(false)
  return (
    <Box ref={ref} display='flex' alignContent='center' {...props}>
      <AccountAddress
        fontWeight={1}
        fontSize={4}
        margin={0}
        overflow='hidden'
        whiteSpace='nowrap'
      >
        {truncate(address)}
      </AccountAddress>
      <Copy
        height='auto'
        display='flex'
        alignItems='center'
        ml={1}
        onClick={() => {
          setCopied(true)
          copyToClipboard(address)
        }}
      >
        <StyledIconCopyAccountAddress />
        <LabelCopy mt={0} ml={1} color='core.secondary'>
          {copied ? 'Copied' : 'Copy'}
        </LabelCopy>
      </Copy>
    </Box>
  )
})

CopyAddress.propTypes = {
  address: ADDRESS_PROPTYPE
}
