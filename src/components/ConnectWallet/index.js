import React, { useReducer, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { OnboardingContainer } from '../StyledComponents'
import { reducer, initialLedgerState, RESET_STATE } from '../../utils/ledger'
import { ConnectWalletContainer, CheckboxContainer } from './styledComponents'

import ConnectedLedgerCheckbox from './ConnectedLedgerCheckbox'
import UnlockedLedgerCheckbox from './UnlockedLedgerCheckbox'
import FilecoinAppOpenCheckbox from './FilecoinAppOpenCheckbox'
import ImportLedgerBtn from './ImportLedgerBtn'

export default () => {
  const dispatchRdx = useDispatch()
  const { errorFromRdx, network } = useSelector(state => ({
    errorFromRdx: state.error,
    network: state.network
  }))
  const [ledgerState, dispatchLocal] = useReducer(reducer, initialLedgerState)

  useEffect(() => {
    if (!errorFromRdx) dispatchLocal({ type: RESET_STATE })
  }, [errorFromRdx])

  return (
    <ConnectWalletContainer>
      <OnboardingContainer>
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
      </OnboardingContainer>
    </ConnectWalletContainer>
  )
}
