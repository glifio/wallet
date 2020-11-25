import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { ADDRESS_PROPTYPE } from '../../../customPropTypes'

import {
  Box,
  Glyph,
  Text,
  Label,
  BaseButton,
  Button,
  IconLedger,
  Tooltip
} from '../../Shared'
import Address from './Address'
import Signers from './Signers'

const ButtonViewOnLedgerDevice = styled(BaseButton)``

const AccountSummary = ({
  msigAddress,
  showOnDevice,
  walletAddress,
  signers,
  reset,
  ledgerBusy,
  error
}) => {
  return (
    <>
    <Box
      display='flex'
      flexDirection='row'
      justifyContent='space-between'
      alignItems='center'
      flexWrap='wrap'
    >
      <Address
        label='Multisig Address'
        address={msigAddress}
        glyphAcronym='Ms'
      />
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
        borderBottomLeftRadius={3}
        borderBottomRightRadius={3}
      >
        {error ? (
          <Box display='flex'>
            <Box
              display='flex'
              alignItems='center'
              color='core.darkgray'
              bg='status.fail.background'
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
              <Box
                display='flex'
                flexDirection='column'
                flexGrow='1'
                color='core.nearblack'
              >
                <Label fontSize={1}>ERROR</Label>
                {error}
              </Box>
            </Box>
            <Button
              type='button'
              variant='secondary'
              title='Retry'
              onClick={reset}
              display='flex'
              alignItems='center'
              minWidth={8}
              border={1}
              bg='transparent'
              borderColor='core.lightgray'
              my={1}
              height={6}
              flexGrow='1'
              borderRadius={6}
            />
          </Box>
        ) : (
          <>
            <Box position='relative' display='flex' flexWrap='wrap'>
              <Address address={walletAddress} label='Your Ledger Address' />

              <ButtonViewOnLedgerDevice
                display='flex'
                alignItems='center'
                maxWidth={10}
                onClick={showOnDevice}
                disabled={ledgerBusy}
                border={1}
                bg='transparent'
                color='core.nearblack'
                my={1}
                height={6}
                flexGrow='1'
                borderRadius={6}
              >
                <IconLedger size={4} mr={2} />
                {ledgerBusy ? (
                  <Text>Check Ledger device</Text>
                ) : (
                  <Text>View</Text>
                )}
              </ButtonViewOnLedgerDevice>
              <Tooltip
                borderColor='core.lightgray'
                content='Displays your address on your Ledger device'
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
    <Signers signers={signers} walletAddress={walletAddress} />
    </>
  )
}

AccountSummary.propTypes = {
  msigAddress: ADDRESS_PROPTYPE,
  walletAddress: ADDRESS_PROPTYPE,
  showOnDevice: PropTypes.func.isRequired,
  ledgerBusy: PropTypes.bool.isRequired,
  error: PropTypes.string,
  reset: PropTypes.func.isRequired,
  signers: PropTypes.arrayOf(
    PropTypes.shape({
      account: ADDRESS_PROPTYPE,
      id: ADDRESS_PROPTYPE
    })
  ).isRequired
}

AccountSummary.defaultProps = {
  error: ''
}

export default AccountSummary
