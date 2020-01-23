import React, { useReducer, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { OnboardingContainer } from '../StyledComponents'
import { reducer, initialLedgerState, RESET_STATE } from '../../utils/ledger'
import { ConnectWalletContainer, CheckboxContainer } from './styledComponents'

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

export default () => {
  const dispatchRdx = useDispatch()
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
            <ImportLedgerBtn
              ledgerState={ledgerState}
              dispatchLocal={dispatchLocal}
              dispatchRdx={dispatchRdx}
              network={network}
            />
          </>
        )}
      </OnboardingContainer>
    </ConnectWalletContainer>
  )
}
