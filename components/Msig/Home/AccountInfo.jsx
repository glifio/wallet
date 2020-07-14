import React from 'react'
import PropTypes from 'prop-types'
import { ADDRESS_PROPTYPE } from '../../../customPropTypes'

import {
  Box,
  Glyph,
  CopyAddress,
  Text,
  BigTitle,
  Button,
  IconLedger
} from '../../Shared'
import truncateAddress from '../../../utils/truncateAddress'

const AccountInfo = ({
  msigAddress,
  setChangingOwner,
  showOnDevice,
  walletAddress
}) => {
  return (
    <Box>
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
        width='300px'
        height='300px'
        borderRadius={3}
        p={3}
        color='card.account.color'
        bg='card.account.background'
        boxShadow={1}
      >
        <Box
          display='flex'
          alignItems='center'
          justifyContent='flex-start'
          color='card.account.color'
        >
          <Glyph mr={3} color='card.account.color' acronym='Ms' />
          <Text>Multisig Actor</Text>
        </Box>
        <Box color='card.account.color'>
          <BigTitle>Address</BigTitle>
          <CopyAddress address={msigAddress} />
        </Box>
        <Box>
          <Button
            variant='tertiary'
            title='Change Owner'
            onClick={setChangingOwner}
            height='max-content'
            p={2}
            py={2}
          />
        </Box>
      </Box>
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
        width='300px'
        height='auto'
        borderRadius={3}
        border={1}
        p={3}
        mt={3}
      >
        <Box display='flex' flexDirection='row'>
          <IconLedger />
          <Text m={0} ml={2} lineHeight='2'>
            Linked to Ledger Device
          </Text>
        </Box>
        <Box display='flex' flexDirection='row'>
          <Text color='core.primary'>{truncateAddress(walletAddress)}</Text>
          <Button
            type='button'
            variant='secondary'
            title='Show on device'
            onClick={showOnDevice}
          />
        </Box>
      </Box>
    </Box>
  )
}

AccountInfo.propTypes = {
  msigAddress: ADDRESS_PROPTYPE,
  walletAddress: ADDRESS_PROPTYPE,
  setChangingOwner: PropTypes.func.isRequired,
  showOnDevice: PropTypes.func.isRequired
}

export default AccountInfo
