import React from 'react'
import PropTypes from 'prop-types'

import { ADDRESS_PROPTYPE } from '../../../customPropTypes'
import { Box, Text } from '../../Shared'
import converAddrToFPrefix from '../../../utils/convertAddrToFPrefix'
import truncateAddress from '../../../utils/truncateAddress'

const Signers = ({ signers, walletAddress }) => {
  return (
    <Box>
      <Text>Signers</Text>
      {signers.map(signer => {
        if (converAddrToFPrefix(signer.account) === walletAddress) {
          return (
            <Box display='flex' key={signer.account}>
              <Text mr={2} color='core.primary'>
                Your ledger address:{' '}
              </Text>
              <Text>{truncateAddress(signer.account)}</Text>
            </Box>
          )
        }
        return (
          <Text key={signer.account}>{truncateAddress(signer.account)}</Text>
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
