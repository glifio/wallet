import React, { useState } from 'react'
import styled from 'styled-components'
import 'styled-components/macro'
import { useDispatch } from 'react-redux'

import { useProgress } from '../../hooks'
import { setWalletType } from '../../store/actions'
import { LEDGER } from '../../constants'
import { OnboardingContainer, JustifyContentCenter } from '../StyledComponents'

const Button = styled.button`
  background: ${props => (props.disabled ? 'grey' : '#61d6d9')};
  color: white;
  border: 0;
  border-radius: 4px;
  margin-bottom: 30px;
  width: 50%;
  align-self: center;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
`

const LedgerWallet = styled.img`
  width: 30%;
  align-self: center;
  margin-top: 30px;
  margin-bottom: 30px;
  cursor: pointer;
  padding: 10px;
  &:hover {
    background-color: #61d6d9;
  }
  &:active {
    transform: scale(1.05);
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
  }
  background-color: ${props => (props.clicked ? '#61d6d9' : 'white')};
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
            setProgress(1)
          }}
        >
          Access wallet
        </Button>
      </OnboardingContainer>
    </JustifyContentCenter>
  )
}
