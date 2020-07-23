import React from 'react'
import { Box, Label, Num } from '../../Shared'
import { FILECOIN_NUMBER_PROP } from '../../../customPropTypes'
import makeFriendlyBalance from '../../../utils/makeFriendlyBalance'

const AvailableBalance = ({ available }) => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      width='100%'
      p={4}
    >
      <Label mb={1} textAlign='center'>
        Available
      </Label>
      <Num size='xxl' color='core.primary'>
        {makeFriendlyBalance(available, 6, true)}
      </Num>
    </Box>
  )
}

AvailableBalance.propTypes = {
  available: FILECOIN_NUMBER_PROP
}

const TotalBalance = ({ total }) => (
  <Box
    display='flex'
    flexDirection='column'
    alignItems='center'
    width='100%'
    p={4}
  >
    <Label mb={1} textAlign='center'>
      Total Vesting
    </Label>
    <Num size='xxl' color='core.primary'>
      {makeFriendlyBalance(total, 6, true)}
    </Num>
  </Box>
)

TotalBalance.propTypes = {
  total: FILECOIN_NUMBER_PROP
}

const Balances = ({ available, total }) => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
    >
      <AvailableBalance available={available} />
      <TotalBalance total={total} />
    </Box>
  )
}

Balances.propTypes = {
  available: FILECOIN_NUMBER_PROP,
  total: FILECOIN_NUMBER_PROP
}

export default Balances
