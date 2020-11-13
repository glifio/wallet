import React from 'react'
import PropTypes from 'prop-types'
import { Box, Input, Text } from '../../Shared'
import { ADDRESS_PROPTYPE } from '../../../customPropTypes'
import { PL_SIGNERS } from '../../../constants'

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
      onChange={e => setSignerAddress(e.target.value)}
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

export const RemoveSignerInput = ({
  signerAddress,
  setSignerAddress,
  signers,
  selfAddress,
  signerAddressError,
  setSignerAddressError,
  step
}) => {
  const disabled = step > 2
  return (
    <Box>
      {signers
        .filter(s => s !== selfAddress)
        .map(s => (
          <Box key={s} display='flex' flexDirection='row' alignItems='center'>
            <Box
              borderRadius='50%'
              width='10px'
              height='10px'
              display='inline-block'
              bg={s === signerAddress ? 'core.primary' : 'core.darkgray'}
              mr={2}
              role='button'
              onClick={() => {
                if (disabled) return
                setSignerAddressError('')
                setSignerAddress(s)
              }}
              css={`
                 {
                  &:hover {
                    cursor: ${step > 2 ? 'not-allowed' : 'pointer'};
                  }
                }
              `}
            />
            <Text>{s}</Text>
            {PL_SIGNERS.has(s) && <Text ml={2}>(Protocol Labs)</Text>}
          </Box>
        ))}
      {signerAddressError && <Text>Please select an address</Text>}
    </Box>
  )
}

RemoveSignerInput.propTypes = {
  selfAddress: ADDRESS_PROPTYPE,
  signerAddress: PropTypes.string.isRequired,
  setSignerAddress: PropTypes.func.isRequired,
  signerAddressError: PropTypes.string,
  signers: PropTypes.array.isRequired,
  step: PropTypes.number.isRequired,
  setSignerAddressError: PropTypes.func.isRequired
}
