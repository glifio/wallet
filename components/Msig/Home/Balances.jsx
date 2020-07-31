import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Box, Num, BaseButton } from '../../Shared'
import { FILECOIN_NUMBER_PROP } from '../../../customPropTypes'
import makeFriendlyBalance from '../../../utils/makeFriendlyBalance'
// import { getByPlaceholderText } from '@testing-library/react'

const ArrowFlow = keyframes`
    0% {
        transform: translate(50%);
        opacity: 1;
    }
    50% {
        transform: translateX(-50%);
        opacity: 0;
    }
    75% {
        opacity: 0;
    }
    100% {
        opacity: 0;
    }
`

const Arrow = () => (
  <Box
    width={5}
    display='flex'
    fontSize={4}
    alignItems='center'
    justifyContent='center'
    css={`
      animation: ${ArrowFlow} 2.4s linear infinite;
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
  border: ${props =>
    props.selected ? '1px solid #44444400' : '1px solid #444444'};
  border-radius: ${props => props.theme.radii[6]};

  transition: 0.24s ease-in-out;

  /* Displays a visual reference (dynamic background) to the real-time vested (i,e. available) balance  */
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 80%;
    background: ${props => props.theme.colors.core.secondary};
    z-index: -9;
    border-radius: ${props => props.theme.radii[6]};
  }

  /* Creates the performative "box-shadow" animation (via opacity animation) */
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: ${props => (props.selected ? '1' : '0')};
    border-radius: ${props => props.theme.radii[6]};
    box-shadow: ${props => props.theme.shadows[2]};
    transition: 0.24s ease-in-out;
  }

  &:hover {
    cursor: ${props => (props.selected ? 'default' : 'pointer')};
    transform: ${props =>
      props.selected ? 'translateY(0%)' : 'translateY(-6%)'};
    opacity: ${props => (props.selected ? '1' : '')};
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
      <Box my={6}>
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
