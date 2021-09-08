import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { ADDRESS_PROPTYPE } from '../../../customPropTypes'

import {
  Box,
  Glyph,
  Text,
  Title,
  Label,
  BaseButton,
  Button,
  IconLedger,
  Tooltip
} from '../../Shared'
import Address from './Address'
import Signers from './Signers'

const ButtonViewOnLedgerDevice = styled(BaseButton)``

const addSigner = () => {
  console.log('addSigner')
}

const removeSigner = () => {
  alert('Does nothing for now. Needs to be moved inline to each signer.')
}

const changeOwner = () => {
  console.log('changeOwner')
}

const AccountSummary = ({
  msigAddress,
  showOnDevice,
  walletAddress,
  signers,
  reset,
  ledgerBusy,
  error
}) => {
  return error ? (
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
    <Box width='100%'>
      <Box position='relative' display='flex' flexWrap='wrap'>
        <Title>Owners</Title>
        <Tooltip content='These are the owners' />
      </Box>
      <Box position='relative' display='flex' flexWrap='wrap' my={3}>
        <Address
          address={walletAddress}
          glyphAcronym={1}
          label='Signer 1 - Your Ledger'
        />

        <ButtonViewOnLedgerDevice
          display='flex'
          alignItems='center'
          maxWidth={10}
          onClick={showOnDevice}
          disabled={ledgerBusy}
          color='core.nearblack'
          border={1}
          bg='transparent'
          my={1}
          ml={3}
          height={6}
          borderRadius={6}
        >
          <IconLedger size={4} mr={2} />
          {ledgerBusy ? (
            <Text>Check Ledger device</Text>
          ) : (
            <Text>View on Device</Text>
          )}
        </ButtonViewOnLedgerDevice>
        <Tooltip content='Displays your address on your Ledger device' />
      </Box>
      <Signers signers={signers} walletAddress={walletAddress} />
      <Box display='flex' alignItems='center'>
        <Button
          type='button'
          variant='secondary'
          onClick={addSigner}
          title='Add Signer'
          minWidth={8}
          height='40px'
          borderRadius={6}
          m={1}
        />
        {signers.length === 1 && (
          <Button
            type='button'
            variant='secondary'
            onClick={changeOwner}
            title='Change Signer'
            height={6}
            maxWidth={10}
            minWidth={9}
            borderRadius={6}
          />
        )}
        {/* Not used for now. This will be moved inline to a singer item */}
        {signers.length > 1 && (
          <Button
            type='button'
            variant='secondary'
            onClick={removeSigner}
            title='Remove Signer'
            minWidth={8}
            height='40px'
            borderRadius={6}
            m={1}
          />
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
