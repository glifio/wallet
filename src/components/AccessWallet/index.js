import React, { useState } from 'react'
import styled from 'styled-components'
import 'styled-components/macro'
import { useDispatch } from 'react-redux'

import { useProgress } from '../../hooks'
import { setWalletType } from '../../store/actions'
import { LEDGER } from '../../constants'
import {
  ButtonBase,
  OnboardingContainer,
  JustifyContentCenter,
  FILECOIN_BLUE,
  WHITE,
  BASE_SIZE_UNIT
} from '../StyledComponents'

const Button = styled(ButtonBase)`
  align-self: center;
  margin-bottom: 30px;
`

const LedgerWallet = styled.img`
  width: 30%;
  align-self: center;
  margin-top: ${BASE_SIZE_UNIT * 6}px;
  margin-bottom: ${BASE_SIZE_UNIT * 6}px;
  cursor: pointer;
  padding: ${BASE_SIZE_UNIT * 2}px;
  &:hover {
    background-color: ${FILECOIN_BLUE};
  }
  &:active {
    transform: scale(1.05);
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
  }
  background-color: ${props => (props.clicked ? FILECOIN_BLUE : WHITE)};
`

export default () => {
  const dispatch = useDispatch()
  const { setProgress } = useProgress()
  const [selectedWalletType, setSelectedWalletType] = useState('')
  return (
    <JustifyContentCenter>
      <OnboardingContainer>
        <LedgerWallet
          onClick={() =>
            selectedWalletType
              ? setSelectedWalletType('')
              : setSelectedWalletType(LEDGER)
          }
          src='/ledger.png'
          clicked={selectedWalletType === LEDGER}
          alt=''
        />
        <Button
          disabled={!selectedWalletType}
          onClick={() => {
            dispatch(setWalletType(selectedWalletType))
            setProgress(2)
          }}
        >
          Access wallet
        </Button>
      </OnboardingContainer>
    </JustifyContentCenter>
  )
}
