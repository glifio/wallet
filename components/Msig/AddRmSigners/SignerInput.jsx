import React from 'react'
import PropTypes from 'prop-types'
import { Box, CopyText, Label, StyledATag, Text } from '@glif/react-components'
import { PL_SIGNERS } from '../../../constants'
import { Input } from '../../Shared'
import truncateAddress from '../../../utils/truncateAddress'

export const AddSignerInput = ({
  signerAddress,
  setSignerAddress,
  signerAddressError,
  setSignerAddressError,
  step
}) => {
  return (
    <Input.Address
      label='New Signer'
      value={signerAddress}
      onChange={(e) => setSignerAddress(e.target.value)}
      error={signerAddressError}
      disabled={step === 3}
      onFocus={() => {
        if (signerAddressError) setSignerAddressError('')
      }}
    />
  )
}

AddSignerInput.propTypes = {
  signerAddress: PropTypes.string.isRequired,
  setSignerAddress: PropTypes.func.isRequired,
  signerAddressError: PropTypes.string,
  step: PropTypes.number.isRequired,
  setSignerAddressError: PropTypes.func.isRequired
}

export const RemoveSignerInput = ({ signerAddress }) => {
  return (
    <Box
      display='flex'
      flexDirection='row'
      alignItems='center'
      width='100%'
      justifyContent='space-between'
      mt={1}
    >
      <Label px={2}>Removing signer</Label>
      <Box display='flex' flexDirection='row' alignItems='center'>
        <StyledATag
          target='_blank'
          href={`https://filfox.info/en/address/${signerAddress}`}
        >
          {`${truncateAddress(signerAddress)}`}
        </StyledATag>
        {PL_SIGNERS.has(signerAddress) && (
          <Text color='core.darkgray' ml={2}>
            (Protocol Labs)
          </Text>
        )}
        <CopyText text={signerAddress} hideCopyText />
      </Box>
    </Box>
  )
}

RemoveSignerInput.propTypes = {
  signerAddress: PropTypes.string.isRequired
}
