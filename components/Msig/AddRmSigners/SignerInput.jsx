import React from 'react'
import PropTypes from 'prop-types'
import { Input } from '../../Shared'
import { ADDRESS_PROPTYPE } from '../../../customPropTypes'

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
  signerAddress: ADDRESS_PROPTYPE,
  setSignerAddress: PropTypes.func.isRequired,
  signerAddressError: PropTypes.string,
  step: PropTypes.number.isRequired,
  setSignerAddressError: PropTypes.func.isRequired
}
