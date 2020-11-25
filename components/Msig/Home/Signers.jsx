import React from 'react'
import PropTypes from 'prop-types'

import { ADDRESS_PROPTYPE } from '../../../customPropTypes'
import { Box, Text } from '../../Shared'
import converAddrToFPrefix from '../../../utils/convertAddrToFPrefix'
import truncateAddress from '../../../utils/truncateAddress'
import Address from './Address'

const Signers = ({ signers, walletAddress }) => {
  return (
    <Box>
      <Text>Signers</Text>
      {signers.map(signer => {
        const isOwner = converAddrToFPrefix(signer.account) === walletAddress
        return (
          <Address
            key={signer.account}
            label={isOwner ? 'Your Ledger Address' : 'Signer'}
            address={truncateAddress(signer.account)}
            isOwnerAddress={isOwner}
          />
        )
      })}
    </Box>
  )
}

Signers.propTypes = {
  signers: PropTypes.arrayOf(
    PropTypes.shape({
      account: ADDRESS_PROPTYPE,
      id: ADDRESS_PROPTYPE
    })
  ).isRequired,
  walletAddress: ADDRESS_PROPTYPE
}

export default Signers
