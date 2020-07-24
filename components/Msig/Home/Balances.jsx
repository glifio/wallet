import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Box, Num, BaseButton } from '../../Shared'
import { FILECOIN_NUMBER_PROP } from '../../../customPropTypes'
import makeFriendlyBalance from '../../../utils/makeFriendlyBalance'
// import { getByPlaceholderText } from '@testing-library/react'

const ArrowFlow = keyframes`
0% { transform:translateX(8px); opacity:0; }
100% { transform:translateX(-8px); opacity:1; }
`

const Arrow = () => (
  <Box
    width={5}
    display='flex'
    fontSize={4}
    alignItems='center'
    justifyContent='center'
    css={`
      animation: ${ArrowFlow} 2s linear infinite;
    `}
  >
    ←
  </Box>
)

const TabButton = styled(BaseButton)`
  position: relative;
  height: ${props => props.theme.sizes[6]}px;
  width: ${props => props.theme.sizes[9]}px;
  color: ${props => props.theme.colors.core.nearblack};
  margin-left: ${props => props.theme.sizes[3]}px;
  margin-right: ${props => props.theme.sizes[3]}px;
  padding: 0;
  background: transparent;
  align-items: center;
  border: 1px solid;
  border-radius: ${props => props.theme.radii[6]};
  box-shadow: ${props =>
    props.selected ? props.theme.shadows[2] : props.theme.shadows[0]};

  transition: 0.24s ease-in-out;

  /* Used to visually render the real-time balance amount  */
  &:before {
    position: absolute;
    top: 0;
    left: 0;
    background: ${props => props.theme.colors.core.secondary};
  }

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
        <TabButton
          onClick={() => setViewAvailable(true)}
          selected={viewAvailable}
          percentage={available / total}
        >
          Available
        </TabButton>
        <Arrow />
        <TabButton
          onClick={() => setViewAvailable(false)}
          selected={!viewAvailable}
          percentage={1 - available / total}
        >
          Total Vesting
        </TabButton>
      </Box>
      <Box my={5}>
        {viewAvailable ? (
          <AvailableBalance available={available} />
        ) : (
          <TotalBalance total={total} />
        )}
      </Box>
    </Box>
  )
}

Balances.propTypes = {
  available: FILECOIN_NUMBER_PROP,
  total: FILECOIN_NUMBER_PROP
}

export default Balances
