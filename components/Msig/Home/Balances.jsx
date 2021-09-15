import React from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { Box, Button, Num, Title } from '@glif/react-components'
import { FILECOIN_NUMBER_PROP } from '../../../customPropTypes'
import makeFriendlyBalance from '../../../utils/makeFriendlyBalance'
import { PAGE } from '../../../constants'
import { navigate } from '../../../utils/urlParams'

const AvailableBalanceContainer = styled(Box)`
  background: linear-gradient(
    169deg,
    hsl(224deg 48% 94%) 5.19%,
    hsl(224deg 48% 93% / 5%) 116.24%
  );
`

const NumberContainer = styled(Box)`
  word-break: break-word;
`

const AvailableBalance = ({ available }) => {
  return (
    <NumberContainer
      display='flex'
      flexDirection='column'
      alignItems='center'
      width='100%'
    >
      <Num size='xxl' color='core.primary'>
        {makeFriendlyBalance(available, 6, true)}
      </Num>
    </NumberContainer>
  )
}

AvailableBalance.propTypes = {
  available: FILECOIN_NUMBER_PROP
}

const WithdrawButton = styled(Button)`
  &:hover {
    opacity: 1;
    transform: translateY(-5%);
  }
`

const TotalBalance = ({ total }) => (
  <NumberContainer
    display='flex'
    flexDirection='column'
    alignItems='center'
    width='100%'
  >
    <Num size='xxl' color='core.darkgray'>
      {makeFriendlyBalance(total, 6, true)}
    </Num>
  </NumberContainer>
)

TotalBalance.propTypes = {
  total: FILECOIN_NUMBER_PROP
}

const Balances = ({ available, total }) => {
  const router = useRouter()
  return (
    <Box
      position='relative'
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      maxWidth={18}
      width='100%'
    >
      <AvailableBalanceContainer
        display='block'
        textAlign='center'
        width='100%'
        p={4}
        pt={6}
        pb={5}
        borderRadius={2}
      >
        <Title fontSize={2} mb={5}>
          Available Balance
        </Title>
        <AvailableBalance available={available} />
        <WithdrawButton
          type='button'
          variant='primary'
          onClick={() => {
            navigate(router, PAGE.MSIG_WITHDRAW)
          }}
          title='Withdraw'
          maxWidth={10}
          minWidth={9}
          mt={5}
          borderRadius={6}
        />
      </AvailableBalanceContainer>
      <Box
        position='relative'
        display='block'
        textAlign='center'
        width='100%'
        p={6}
      >
        <Title fontSize={2} mb={5}>
          Total Vesting
        </Title>
        <TotalBalance total={total} />
      </Box>
    </Box>
  )
}

Balances.propTypes = {
  available: FILECOIN_NUMBER_PROP,
  total: FILECOIN_NUMBER_PROP
}

export default Balances
