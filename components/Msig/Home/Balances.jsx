import React from 'react'
import styled from 'styled-components'
import { func } from 'prop-types'
import { Box, Button, Num, Title } from '../../Shared'
import { FILECOIN_NUMBER_PROP } from '../../../customPropTypes'
import makeFriendlyBalance from '../../../utils/makeFriendlyBalance'

const BalanceContainer = styled(Box)`
  word-break: break-word;
`

const AvailableBalance = ({ available }) => {
  return (
    <BalanceContainer
      display='flex'
      flexDirection='column'
      alignItems='center'
      width='100%'
    >
      <Num size='xxl' color='core.primary'>
        {makeFriendlyBalance(available, 6, true)}
      </Num>
    </BalanceContainer>
  )
}

AvailableBalance.propTypes = {
  available: FILECOIN_NUMBER_PROP
}

const WithdrawButton = styled(Button)`
  left: 50%;
  top: 0%;
  transform: translate(-50%, -50%);
  opacity: 1;
  &:hover {
    opacity: 1;
    transform: translate(-50%, -57%);
  }
`

const TotalBalance = ({ total }) => (
  <BalanceContainer
    display='flex'
    flexDirection='column'
    alignItems='center'
    width='100%'
  >
    <Num size='xxl' color='core.primary'>
      {makeFriendlyBalance(total, 6, true)}
    </Num>
  </BalanceContainer>
)

TotalBalance.propTypes = {
  total: FILECOIN_NUMBER_PROP
}

const Balances = ({ available, setWithdrawing, total }) => {
  return (
    <Box
      position='relative'
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      maxWidth={18}
      width='100%'
      bg='background.messageHistory'
      borderRadius={2}
      boxShadow={2}
    >
      <Box display='block' textAlign='center' width='100%' p={6}>
        <Title fontSize={2}>Available Balance</Title>
        <AvailableBalance available={available} />
      </Box>

      <Box
        position='relative'
        display='block'
        textAlign='center'
        borderTop={1}
        borderColor='core.lightgray'
        width='100%'
        p={6}
      >
        <Title fontSize={2}>Total Vesting</Title>
        <TotalBalance total={total} />

        <WithdrawButton
          position='absolute'
          type='button'
          variant='primary'
          onClick={setWithdrawing}
          title='Withdraw'
          maxWidth={10}
          minWidth={9}
          mb={3}
          borderRadius={6}
        />
      </Box>
    </Box>
  )
}

Balances.propTypes = {
  available: FILECOIN_NUMBER_PROP,
  total: FILECOIN_NUMBER_PROP,
  setWithdrawing: func.isRequired
}

export default Balances
