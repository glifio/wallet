import React, { useState } from 'react'
import styled from 'styled-components'
import { Box, Label, Num, BaseButton } from '../../Shared'
import { FILECOIN_NUMBER_PROP } from '../../../customPropTypes'
import makeFriendlyBalance from '../../../utils/makeFriendlyBalance'

const TabButton = styled(BaseButton)`
  color: ${props => props.theme.colors.core.nearblack};
  margin-left: ${props => props.theme.sizes[3]}px;
  margin-right: ${props => props.theme.sizes[3]}px;
  background: transparent;
  align-content: center;
  border: 1px solid;
  border-radius: ${props => props.theme.radii[6]};
  padding-top: ${props => props.theme.sizes[3]}px;
  padding-bottom: ${props => props.theme.sizes[3]}px;
  padding-left: ${props => props.theme.sizes[4]}px;
  padding-right: ${props => props.theme.sizes[4]}px;
  transition: 0.24s ease-in-out;

  &:hover {
    transform: translateY(-6%);
  }

  &:focus {
    outline: 0;
  }
`

const AvailableBalance = ({ available }) => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      width='100%'
      p={4}
    >
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
    <Num size='xxl' color='core.primary'>
      {makeFriendlyBalance(total, 6, true)}
    </Num>
  </Box>
)

TotalBalance.propTypes = {
  total: FILECOIN_NUMBER_PROP
}

const Balances = ({ available, total }) => {
  const [viewAvailable, setViewAvailable] = useState(true)

  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
    >
      <Box display='flex' flexGrow='1' justifyContent='space-between'>
        <TabButton onClick={() => setViewAvailable(!viewAvailable)}>
          Available
        </TabButton>
        <TabButton onClick={() => setViewAvailable(!viewAvailable)}>
          Total Vesting
        </TabButton>
      </Box>
      {viewAvailable ? (
        <AvailableBalance available={available} />
      ) : (
        <TotalBalance total={total} />
      )}
    </Box>
  )
}

Balances.propTypes = {
  available: FILECOIN_NUMBER_PROP,
  total: FILECOIN_NUMBER_PROP
}

export default Balances
