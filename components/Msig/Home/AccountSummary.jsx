import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { ADDRESS_PROPTYPE } from '../../../customPropTypes'

import {
  Box,
  Glyph,
  CopyAddress,
  Text,
  Label,
  BaseButton,
  Button,
  IconLedger,
  Tooltip
} from '../../Shared'

const ButtonViewOnLedgerDevice = styled(BaseButton)``

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
      flexDirection='row'
      justifyContent='space-between'
      alignItems='center'
      flexWrap='wrap'
    >
      <Box display='flex' color='card.account.color'>
        <Box
          display='flex'
          alignItems='center'
          justifyContent='flex-start'
          color='core.darkgray'
          bg='background.messageHistory'
          height={6}
          px={2}
          mr={2}
          my={1}
          borderRadius={2}
        >
          <Glyph
            mr={3}
            color='core.nearblack'
            acronym='Ms'
            size={5}
            border={0}
          />
          <Box flexGrow='1'>
            <Label fontSize={1}>Multisig Address</Label>
            <CopyAddress
              justifyContent='space-between'
              color='core.nearblack'
              address={msigAddress}
            />
          </Box>
        </Box>
      </Box>
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
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
              <Box
                display='flex'
                alignItems='center'
                color='core.darkgray'
                bg='background.messageHistory'
                height={6}
                px={2}
                mr={2}
                my={1}
                borderRadius={2}
              >
                <Glyph
                  justifyContent='flex-end'
                  alignSelf='flex-end'
                  mb='1px'
                  mr={3}
                  size={5}
                  Icon={IconLedger}
                  color='core.nearblack'
                  bg='transparent'
                  fill='#444'
                  border={0}
                  css='transform:translateY(-6px)'
                />
                <Box flexGrow='1'>
                  <Label fontSize={1}>Ledger Address</Label>
                  <CopyAddress
                    justifyContent='space-between'
                    color='core.nearblack'
                    address={walletAddress}
                  />
                </Box>
              </Box>
              <ButtonViewOnLedgerDevice
                display='flex'
                alignItems='center'
                ml={2}
                onClick={showOnDevice}
                disabled={ledgerBusy}
                bg='background.messageHistory'
                border={0}
                my={1}
                height={6}
                flexGrow='1'
              >
                <IconLedger size={4} mr={2} />
                {ledgerBusy ? (
                  <Text>Look at your Ledger device</Text>
                ) : (
                  <Text>View</Text>
                )}
                <Tooltip content='Displays your address on your Ledger device' />
              </ButtonViewOnLedgerDevice>
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
