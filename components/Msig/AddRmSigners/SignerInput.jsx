import React from 'react'
import PropTypes from 'prop-types'
import { Box, Input, Text } from '../../Shared'
import { ADDRESS_PROPTYPE } from '../../../customPropTypes'
import { PL_SIGNERS } from '../../../constants'
import converAddrToFPrefix from '../../../utils/convertAddrToFPrefix'
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
        .filter(
          s =>
            converAddrToFPrefix(s.account) !== converAddrToFPrefix(selfAddress)
        )
        .map(s => (
          <Box
            key={s.account}
            display='flex'
            flexDirection='row'
            alignItems='center'
            onClick={() => {
              if (disabled) return
              setSignerAddressError('')
              setSignerAddress(s.account)
            }}
            css={`
               {
                &:hover {
                  cursor: ${step > 2 ? 'not-allowed' : 'pointer'};
                }
              }
            `}
          >
            <Box
              borderRadius='50%'
              width={3}
              height={3}
              display='inline-block'
              border={1}
              borderColor='core.primary'
              bg={
                converAddrToFPrefix(s.account) ===
                converAddrToFPrefix(signerAddress)
                  ? 'core.primary'
                  : 'core.transparent'
              }
              mr={2}
              role='button'
            />
            <Text>{`${truncateAddress(s.account)} (${s.id})`}</Text>
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
  signers: PropTypes.arrayOf(
    PropTypes.shape({
      account: ADDRESS_PROPTYPE,
      id: ADDRESS_PROPTYPE
    })
  ),
  step: PropTypes.number.isRequired,
  setSignerAddressError: PropTypes.func.isRequired
}
