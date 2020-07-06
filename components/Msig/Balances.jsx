import React from 'react'
import { func } from 'prop-types'

import copyToClipboard from '../../utils/copyToClipboard'
import {
  Box,
  Card,
  Copy,
  Glyph,
  Label,
  Text,
  StyledIconCopyAccountAddress,
  Button,
  BigTitle
} from '../Shared'
import { ADDRESS_PROPTYPE, FILECOIN_NUMBER_PROP } from '../../customPropTypes'
import makeFriendlyBalance from '../../utils/makeFriendlyBalance'

const LeftBalance = ({ address, available, setWithdrawing }) => {
  return (
    <Card
      p={3}
      border={0}
      borderRadius={2}
      borderWidth={1}
      overflow='hidden'
      display='flex'
      flexDirection='row'
      justifyContent='center'
      maxWidth='380px'
      maxHeight='380px'
      minHeight='380px'
      width='380px'
      height='380px'
      bg='background.screen'
      boxShadow={2}
    >
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
        alignItems='center'
        height='100%'
        width='100%'
      >
        <Box
          display='flex'
          flexDirection='row'
          justifyContent='space-between'
          alignItems='center'
          width='100%'
        >
          <Box display='flex' flexDirection='row' alignItems='center'>
            <Glyph mr={3} color='core.primary' acronym='Ac' />
            <Text margin={0} color='core.primary'>
              Account
            </Text>
          </Box>
          <Box display='flex' alignContent='center'>
            <Text
              margin={0}
              overflow='hidden'
              whiteSpace='nowrap'
              color='core.yellow'
            >
              {address}
            </Text>
            <Copy
              display='flex'
              alignItems='center'
              ml={1}
              onClick={() => {
                copyToClipboard(address)
              }}
            >
              <StyledIconCopyAccountAddress />
            </Copy>
          </Box>
        </Box>
        <Box display='flex' flexDirection='column'>
          <Label mb={1} textAlign='center'>
            Available
          </Label>
          <BigTitle color='core.primary'>
            {makeFriendlyBalance(available, 6, true)}
          </BigTitle>
        </Box>
        <Button variant='primary' title='Withdraw' onClick={setWithdrawing} />
      </Box>
    </Card>
  )
}

LeftBalance.propTypes = {
  available: FILECOIN_NUMBER_PROP,
  address: ADDRESS_PROPTYPE,
  setWithdrawing: func.isRequired
}

const RightBalance = ({ total }) => (
  <Card
    border={0}
    overflow='hidden'
    display='flex'
    flexDirection='row'
    justifyContent='center'
    maxWidth='380px'
    maxHeight='380px'
    minHeight='380px'
    width='380px'
    height='380px'
  >
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      alignItems='center'
      height='100%'
      width='100%'
    >
      <div />
      <Box display='flex' flexDirection='column'>
        <Label mb={1} textAlign='center'>
          Total Vesting
        </Label>
        <BigTitle color='core.primary'>
          {makeFriendlyBalance(total, 6, true)}
        </BigTitle>
      </Box>
      <div />
    </Box>
  </Card>
)

RightBalance.propTypes = {
  total: FILECOIN_NUMBER_PROP
}

const Balances = ({ address, available, setWithdrawing, total }) => {
  return (
    <Box
      display='flex'
      flexDirection='row'
      justifyContent='space-around'
      width='100%'
    >
      <LeftBalance
        address={address}
        available={available}
        setWithdrawing={setWithdrawing}
      />
      <RightBalance total={total} />
    </Box>
  )
}

Balances.propTypes = {
  available: FILECOIN_NUMBER_PROP,
  total: FILECOIN_NUMBER_PROP,
  address: ADDRESS_PROPTYPE,
  setWithdrawing: func.isRequired
}

export default Balances
