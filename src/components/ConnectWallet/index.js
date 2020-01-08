import React, { useState, useReducer } from 'react'
import styled from 'styled-components'
import 'styled-components/macro'
import TransportWebHID from '@ledgerhq/hw-transport-webhid'
import Filecoin, {
  LedgerProvider
} from '@openworklabs/filecoin-wallet-provider'
import { useDispatch } from 'react-redux'

import { error } from '../../store/actions'
import { useProgress } from '../../hooks'
import { OnboardingContainer } from '../StyledComponents'
import {
  reducer,
  initialLedgerState,
  USER_VERIFIED_LEDGER_CONNECTED,
  USER_UNVERIFIED_LEDGER_CONNECTED,
  USER_VERIFIED_LEDGER_UNLOCKED,
  USER_UNVERIFIED_LEDGER_UNLOCKED,
  USER_VERIFIED_FILECOIN_APP_OPEN,
  USER_UNVERIFIED_FILECOIN_APP_OPEN,
  USER_INITIATED_IMPORT,
  LEDGER_NOT_FOUND,
  RESET_STATE,
  LEDGER_CONNECTED
} from './ledgerStateManagement'
import {
  ConnectWalletContainer,
  EducationalCheckboxContainer,
  EducationalCheckboxItem,
  Checkbox,
  ColoredDot,
  InputLabel,
  Button
} from './styledComponents'
import { determineDotColorForLedgerConnection } from './helpers'

export default () => {
  const dispatchRdx = useDispatch()
  const [ledgerState, dispatchLocal] = useReducer(reducer, initialLedgerState)
  const { setProgress } = useProgress()

  return (
    <ConnectWalletContainer>
      <OnboardingContainer>
        <form>
          <EducationalCheckboxContainer>
            <EducationalCheckboxItem>
              {!ledgerState.userInitiatedImport ? (
                <Checkbox
                  onChange={() =>
                    dispatchLocal({
                      type: ledgerState.userVerifiedLedgerConnected
                        ? USER_UNVERIFIED_LEDGER_CONNECTED
                        : USER_VERIFIED_LEDGER_CONNECTED
                    })
                  }
                  type='checkbox'
                  name='ledger_connected'
                  id='ledger_connected'
                  checked={ledgerState.userVerifiedLedgerConnected}
                />
              ) : (
                <ColoredDot
                  color={determineDotColorForLedgerConnection(ledgerState)}
                />
              )}
              <InputLabel htmlFor='ledger_connected'>
                I have connected my Ledger device to my computer.
              </InputLabel>
            </EducationalCheckboxItem>
            <EducationalCheckboxItem>
              <Checkbox
                onChange={() =>
                  dispatchLocal({
                    type: ledgerState.userVerifiedLedgerUnlocked
                      ? USER_UNVERIFIED_LEDGER_UNLOCKED
                      : USER_VERIFIED_LEDGER_UNLOCKED
                  })
                }
                type='checkbox'
                name='ledger_unlocked'
                id='ledger_unlocked'
                checked={ledgerState.userVerifiedLedgerUnlocked}
                disabled={!ledgerState.userVerifiedLedgerConnected}
              />
              <InputLabel
                htmlFor='ledger_unlocked'
                disabled={!ledgerState.userVerifiedLedgerConnected}
              >
                My Ledger device is unlocked.
              </InputLabel>
            </EducationalCheckboxItem>
            <EducationalCheckboxItem>
              <Checkbox
                onChange={() =>
                  dispatchLocal({
                    type: ledgerState.userVerifiedFilecoinAppOpen
                      ? USER_UNVERIFIED_FILECOIN_APP_OPEN
                      : USER_VERIFIED_FILECOIN_APP_OPEN
                  })
                }
                type='checkbox'
                name='filecoin_app_open'
                id='filecoin_app_open'
                checked={ledgerState.userVerifiedFilecoinAppOpen}
                disabled={
                  !ledgerState.userVerifiedLedgerConnected ||
                  !ledgerState.userVerifiedLedgerUnlocked
                }
              />
              <InputLabel
                htmlFor='filecoin_app_open'
                disabled={
                  !ledgerState.userVerifiedLedgerConnected ||
                  !ledgerState.userVerifiedLedgerUnlocked
                }
              >
                The Filecoin Ledger app is open on my Ledger.
              </InputLabel>
            </EducationalCheckboxItem>
          </EducationalCheckboxContainer>
        </form>
        <Button
          disabled={
            !(
              ledgerState.userVerifiedLedgerConnected &&
              ledgerState.userVerifiedLedgerUnlocked &&
              ledgerState.userVerifiedFilecoinAppOpen
            )
          }
          onClick={async () => {
            dispatchLocal({ type: USER_INITIATED_IMPORT })
            try {
              const transport = await TransportWebHID.create()
              dispatchLocal({ type: LEDGER_CONNECTED })
            } catch (err) {
              dispatchLocal({ type: LEDGER_NOT_FOUND })
              // if we want to display banner instead:
              // dispatchRdx(error(err))
            }

            // const provider = new Filecoin(new LedgerProvider(transport), {
            //   token: process.env.REACT_APP_LOTUS_JWT_TOKEN
            // })

            // // we call getVersion here to make sure the Filecoin Ledger app is open on the user's device
            // await provider.wallet.getVersion()
            // setFilecoinLedgerAppOpen(true)

            // const accountList = await provider.wallet.getAccounts(
            //   accounts.startIdx,
            //   accounts.endIdx
            // )
            // setAccounts({
            //   ...accounts,
            //   list: accountList
            // })
          }}
        >
          Import Ledger Wallet
        </Button>
      </OnboardingContainer>
    </ConnectWalletContainer>
  )
}
