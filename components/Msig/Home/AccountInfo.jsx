import React from 'react'
import PropTypes from 'prop-types'
import { ADDRESS_PROPTYPE } from '../../../customPropTypes'
import {
  Box,
  Glyph,
  CopyAddress,
  Text,
  Button,
  IconLedger,
  Title as AccountAddress
} from '../../Shared'
import truncateAddress from '../../../utils/truncateAddress'

const AccountInfo = ({
  msigAddress,
  showOnDevice,
  walletAddress,
  reset,
  ledgerBusy,
  error
}) => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      boxShadow={2}
      borderRadius={3}
      maxWidth={11}
    >
      <Box
        display='flex'
        flexDirection='column'
        width={11}
        height={8}
        borderTopLeftRadius={3}
        borderTopRightRadius={3}
        p={3}
        color='card.account.color'
        bg='card.account.background'
      >
        <Box
          display='flex'
          alignItems='center'
          justifyContent='flex-start'
          color='card.account.color'
        >
          <Glyph mr={3} color='card.account.color' acronym='Ms' />
          <Box flexGrow='1' color='card.account.color'>
            <Text m={0}>Multisig Account</Text>
            <CopyAddress address={msigAddress} />
          </Box>
        </Box>
      </Box>
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
        width={11}
        height='auto'
        borderBottomLeftRadius={3}
        borderBottomRightRadius={3}
        p={3}
      >
        {error ? (
          <>
            <Box display='flex' flexDirection='row'>
              <IconLedger />
              <Text m={0} ml={2} lineHeight='2'>
                Error
              </Text>
            </Box>
            <Box display='flex' flexDirection='column'>
              <Text color='core.primary'>{error}</Text>
              <Button
                type='button'
                variant='secondary'
                title='Retry'
                onClick={reset}
              />
            </Box>
          </>
        ) : (
          <>
            <Box display='flex' flexDirection='row'>
              <Box>
                {' '}
                <Glyph
                  mr={3}
                  Icon={IconLedger}
                  color='core.nearblack'
                  fill='#444'
                />
              </Box>
              <Box display='flex' flexDirection='column' height={6}>
                <Text m={0}>Linked to Ledger Device</Text>
                <Box
                  display='flex'
                  justifyContent='space-between'
                  alignItems='center'
                  flexGrow='1'
                >
                  <AccountAddress m={0}>
                    {truncateAddress(walletAddress)}
                  </AccountAddress>
                  <Button
                    height='auto'
                    py={0}
                    px={0}
                    border={0}
                    type='button'
                    variant='secondary'
                    title='View'
                    color='core.primary'
                    disabled={ledgerBusy}
                    onClick={showOnDevice}
                  />
                </Box>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}

AccountInfo.propTypes = {
  msigAddress: ADDRESS_PROPTYPE,
  walletAddress: ADDRESS_PROPTYPE,
  showOnDevice: PropTypes.func.isRequired,
  ledgerBusy: PropTypes.bool.isRequired,
  error: PropTypes.string,
  reset: PropTypes.func.isRequired
}

AccountInfo.defaultProps = {
  error: ''
}

export default AccountInfo
