import React from 'react'
import PropTypes from 'prop-types'
import Balances from './Balances'
import {
  ADDRESS_PROPTYPE,
  FILECOIN_NUMBER_PROP
} from '../../../customPropTypes'
import { Box, Button } from '../../Shared'
import AccountInfo from './AccountInfo'

const State = ({
  msigAddress,
  available,
  setChangingOwner,
  setWithdrawing,
  showOnDevice,
  total,
  walletAddress
}) => {
  return (
    <Box display='flex' flexDirection='row'>
      <AccountInfo
        msigAddress={msigAddress}
        walletAddress={walletAddress}
        showOnDevice={showOnDevice}
        setChangingOwner={setChangingOwner}
      />
      <Box display='flex' flexDirection='column'>
        <Balances available={available} total={total} />
        <Button
          type='button'
          variant='primary'
          onClick={setWithdrawing}
          title='Withdraw'
        />
      </Box>
    </Box>
  )
}

State.propTypes = {
  available: FILECOIN_NUMBER_PROP,
  total: FILECOIN_NUMBER_PROP,
  msigAddress: ADDRESS_PROPTYPE,
  walletAddress: ADDRESS_PROPTYPE,
  setChangingOwner: PropTypes.func.isRequired,
  setWithdrawing: PropTypes.func.isRequired,
  showOnDevice: PropTypes.func.isRequired
}

export default State
