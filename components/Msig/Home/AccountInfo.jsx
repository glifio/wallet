import React from 'react'
import PropTypes from 'prop-types'
import { ADDRESS_PROPTYPE } from '../../../customPropTypes'

import { Box, Glyph, CopyAddress, Text, Button, IconLedger } from '../../Shared'
import truncateAddress from '../../../utils/truncateAddress'

const AccountInfo = ({
  msigAddress,
  setChangingOwner,
  showOnDevice,
  walletAddress,
  reset,
  ledgerBusy,
  error
}) => {
  return (
    <Box>
      <Box display='flex' flexDirection='column' boxShadow={2} borderRadius={3}>
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
              <CopyAddress
                justifyContent='space-between'
                address={msigAddress}
              />
            </Box>
          </Box>

          {/* <Box>
          <Button
            variant='tertiary'
            title='Change Owner'
            onClick={setChangingOwner}
            height='max-content'
            p={2}
            py={2}
          />
        </Box> */}
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
              <Box
                display='flex'
                flexDirection='row'
                justifyContent='space-between'
              >
                <Box>
                  <IconLedger />
                </Box>
                <Box display='flex' flexDirection='column'>
                  <Text m={0} fontSize={3}>
                    Linked to Ledger Device
                  </Text>
                  <Box
                    display='flex'
                    justifyContent='space-between'
                    alignItems='center'
                    flexGrow='1'
                  >
                    <Text m={0}>{truncateAddress(walletAddress)}</Text>
                    <Button
                      p={2}
                      border={0}
                      type='button'
                      variant='secondary'
                      title='VIEW'
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
    </Box>
  )
}

AccountInfo.propTypes = {
  msigAddress: ADDRESS_PROPTYPE,
  walletAddress: ADDRESS_PROPTYPE,
  setChangingOwner: PropTypes.func.isRequired,
  showOnDevice: PropTypes.func.isRequired,
  ledgerBusy: PropTypes.bool.isRequired,
  error: PropTypes.string,
  reset: PropTypes.func.isRequired
}

AccountInfo.defaultProps = {
  error: ''
}

export default AccountInfo
