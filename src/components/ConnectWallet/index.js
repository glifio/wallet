import React, { useReducer, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import {
  OnboardingContainer,
  ButtonBase,
  JustifyContentContainer
} from '../StyledComponents'
import { reducer, initialLedgerState, RESET_STATE } from '../../utils/ledger'
import { ConnectWalletContainer, CheckboxContainer } from './styledComponents'
import { useProgress } from '../../hooks'

import ConnectedLedgerCheckbox from './ConnectedLedgerCheckbox'
import UnlockedLedgerCheckbox from './UnlockedLedgerCheckbox'
import FilecoinAppOpenCheckbox from './FilecoinAppOpenCheckbox'
import ImportLedgerBtn from './ImportLedgerBtn'

const LoadingContainer = styled.div`
  align-self: center;
`

const LoadingEmoji = styled.span`
  font-size: 20px;
  align-self: center;
  line-height: 15;
`

export const Directions = styled.div`
  padding: 20px 40px;
  font-size: 18px;
  font-weight: bold;
`

export default () => {
  const dispatchRdx = useDispatch()
  const { setProgress } = useProgress()
  const { errorFromRdx, network, provider } = useSelector(state => ({
    errorFromRdx: state.error,
    network: state.network,
    provider: state.walletProvider
  }))
  const [ledgerState, dispatchLocal] = useReducer(reducer, initialLedgerState)

  useEffect(() => {
    if (!errorFromRdx) dispatchLocal({ type: RESET_STATE })
  }, [errorFromRdx])

  const showLoading =
    ledgerState.userInitiatedImport &&
    !ledgerState.userImportFailure &&
    provider &&
    !errorFromRdx

  return (
    <ConnectWalletContainer>
      <OnboardingContainer>
        {showLoading ? (
          <LoadingContainer>
            {/* eslint-disable jsx-a11y/accessible-emoji */}
            <LoadingEmoji role='img' aria-label='loading'>
              ⌛Loading...
            </LoadingEmoji>
          </LoadingContainer>
        ) : (
          <>
            <form>
              <Directions>
                Welcome to the Filecoin web wallet. Check the boxes when you've
                completed these steps.
              </Directions>
              <CheckboxContainer>
                <ConnectedLedgerCheckbox
                  ledgerState={ledgerState}
                  dispatchLocal={dispatchLocal}
                />
                <UnlockedLedgerCheckbox
                  ledgerState={ledgerState}
                  dispatchLocal={dispatchLocal}
                />
                <FilecoinAppOpenCheckbox
                  ledgerState={ledgerState}
                  dispatchLocal={dispatchLocal}
                />
              </CheckboxContainer>
            </form>
            <JustifyContentContainer
              flexDirection='row'
              justifyContent='space-around'
            >
              <ButtonBase onClick={() => setProgress(0)}>Back</ButtonBase>
              <ImportLedgerBtn
                ledgerState={ledgerState}
                dispatchLocal={dispatchLocal}
                dispatchRdx={dispatchRdx}
                network={network}
              />
            </JustifyContentContainer>
          </>
        )}
      </OnboardingContainer>
    </ConnectWalletContainer>
  )
}
