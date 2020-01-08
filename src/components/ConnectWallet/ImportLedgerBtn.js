import React from 'react'
import 'styled-components/macro'
import TransportWebHID from '@ledgerhq/hw-transport-webhid'
import Filecoin, {
  LedgerProvider
} from '@openworklabs/filecoin-wallet-provider'

import { error, walletList, createWalletProvider } from '../../store/actions'
import { useProgress } from '../../hooks'
import {
  USER_INITIATED_IMPORT,
  LEDGER_NOT_FOUND,
  ESTABLISHING_CONNECTION_W_FILECOIN_APP,
  FILECOIN_APP_NOT_OPEN,
  FILECOIN_APP_OPEN,
  LEDGER_LOCKED,
  LEDGER_UNLOCKED,
  LEDGER_CONNECTED
} from './ledgerStateManagement'
import { Button } from './styledComponents'
import { useSelector } from 'react-redux'

const ImportLedgerBtn = ({ ledgerState, dispatchRdx, dispatchLocal }) => {
  const { setProgress } = useProgress()
  const walletProvider = useSelector(state => state.walletProvider)
  return (
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
        let transport = ledgerState.transport
        try {
          if (!transport) {
            transport = await TransportWebHID.create()
          }
          dispatchLocal({ type: LEDGER_CONNECTED, transport })
        } catch (err) {
          if (
            err.message &&
            !err.message.toLowerCase().includes('device is already open')
          ) {
            dispatchLocal({ type: LEDGER_NOT_FOUND })
            // if we want to display banner instead:
            dispatchRdx(error(err))
            return
          }
        }

        dispatchLocal({ type: ESTABLISHING_CONNECTION_W_FILECOIN_APP })
        let provider = walletProvider
        if (!provider) {
          try {
            provider = new Filecoin(new LedgerProvider(transport), {
              token: process.env.REACT_APP_LOTUS_JWT_TOKEN
            })
            const response = await provider.wallet.getVersion()
            if (response.device_locked) {
              dispatchLocal({ type: LEDGER_LOCKED })
              dispatchRdx(error(new Error('Ledger device locked')))
              return
            }

            dispatchLocal({ type: LEDGER_UNLOCKED })
            dispatchLocal({ type: FILECOIN_APP_OPEN })
            dispatchRdx(createWalletProvider(provider))
          } catch (err) {
            dispatchLocal({ type: FILECOIN_APP_NOT_OPEN })
            dispatchRdx(error(err))
            return
          }
        }

        try {
          const filAddresses = await provider.wallet.getAccounts(0, 1)
          const wallets = await Promise.all(
            filAddresses.map(async address => {
              const balance = await provider.getBalance(
                't1e2tmlvccdm6zdwxlu5h7mtihs3w23cqs5gg3c4q'
              )
              return {
                balance,
                address
              }
            })
          )
          dispatchRdx(walletList(wallets))
          setProgress(2)
        } catch (err) {
          dispatchRdx(error(err))
        }
      }}
    >
      {ledgerState.userImportFailure ? 'Try again' : 'Import Ledger Wallet'}
    </Button>
  )
}

export default ImportLedgerBtn
