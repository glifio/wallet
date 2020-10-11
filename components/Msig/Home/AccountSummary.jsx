import React from 'react'
import PropTypes from 'prop-types'
import { ADDRESS_PROPTYPE } from '../../../customPropTypes'

import { Box, Glyph, CopyAddress, Text, Button, IconLedger } from '../../Shared'
import truncateAddress from '../../../utils/truncateAddress'

const AccountSummary = ({
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
      alignItems='flex-start'
    >
      <Box display='flex' color='card.account.color'>
        <Glyph mr={3} color='core.nearblack' acronym='Ms' border={1} />
        <Box
          display='flex'
          alignItems='center'
          justifyContent='flex-start'
          color='core.darkgray'
          bg='background.messageHistory'
          p={2}
          borderRadius={2}
          width={11}
          height='40px'
        >
          <Box flexGrow='1'>
            <CopyAddress
              justifyContent='space-between'
              color='core.darkgray'
              address={msigAddress}
            />
          </Box>
        </Box>
      </Box>
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
        height='auto'
        borderBottomLeftRadius={3}
        borderBottomRightRadius={3}
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
            <Box position='relative' display='flex' color='card.account.color'>
              <Glyph
                mr={3}
                Icon={IconLedger}
                color='core.nearblack'
                bg='core.white'
                fill='#444'
                borderRadius={6}
                border={1}
                css='transform:translateY(-6px)'
              />
              <Box
                display='flex'
                alignItems='center'
                justifyContent='flex-start'
                color='core.darkgray'
                bg='background.messageHistory'
                p={2}
                borderRadius={2}
                width={11}
                height='40px'
              >
                <Box flexGrow='1'>
                  <CopyAddress
                    justifyContent='space-between'
                    color='core.darkgray'
                    address={walletAddress}
                  />
                </Box>
              </Box>
              <Button
                title='View Address on Ledger Device'
                variant='secondary'
                borderColor='silver'
                background='transparent'
                color='core.darkgray'
                height='40px'
                ml={2}
                onClick={showOnDevice}
                disabled={ledgerBusy}
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}

AccountSummary.propTypes = {
  msigAddress: ADDRESS_PROPTYPE,
  walletAddress: ADDRESS_PROPTYPE,
  showOnDevice: PropTypes.func.isRequired,
  ledgerBusy: PropTypes.bool.isRequired,
  error: PropTypes.string,
  reset: PropTypes.func.isRequired
}

AccountSummary.defaultProps = {
  error: ''
}

export default AccountSummary
