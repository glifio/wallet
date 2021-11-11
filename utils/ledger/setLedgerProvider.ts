import Filecoin, { WalletSubProvider } from '@glif/filecoin-wallet-provider'
import { Dispatch } from 'redux'
import { createWalletProvider } from '../../WalletProvider/state'
import createTransport from './createTransport'
import reportError from '../reportError'
import badVersion from './badVersion'
import { WalletProviderAction } from '../../WalletProvider/types'

export interface LedgerSubProvider extends WalletSubProvider {
  getVersion: () => any
  showAddressAndPubKey: () => any
}

export const setLedgerProvider = async (
  dispatch: Dispatch<WalletProviderAction>,
  LedgerProvider: (_: any) => LedgerSubProvider
): Promise<(Filecoin & { wallet: LedgerSubProvider }) | null> => {
  dispatch({ type: 'LEDGER_USER_INITIATED_IMPORT' })
  try {
    const transport = await createTransport()
    const provider = new Filecoin(LedgerProvider(transport), {
      apiAddress: process.env.LOTUS_NODE_JSONRPC
    })
    dispatch({ type: 'LEDGER_CONNECTED' })
    dispatch(createWalletProvider(provider))
    return provider as Filecoin & { wallet: LedgerSubProvider }
  } catch (err) {
    if (err?.message.includes('TRANSPORT NOT SUPPORTED BY DEVICE')) {
      dispatch({ type: 'WEBUSB_UNSUPPORTED' })
    } else if (
      err?.message.toLowerCase().includes('unable to claim interface.') ||
      err?.message.toLowerCase().includes('failed to open the device')
    ) {
      dispatch({ type: 'LEDGER_USED_BY_ANOTHER_APP' })
    } else if (
      err?.message.toLowerCase().includes('transporterror: invalid channel')
    ) {
      dispatch({ type: 'LEDGER_REPLUG' })
    } else if (
      err?.message.toLowerCase().includes('no device selected') ||
      err?.message.toLowerCase().includes('access denied to use ledger device')
    ) {
      dispatch({ type: 'LEDGER_NOT_FOUND' })
    }
    reportError(
      5,
      false,
      `Unhandled error in setLedgerProvider: ${err.message}`,
      err.stack
    )
    return null
  }
}

export const checkLedgerConfiguration = async (
  dispatch: Dispatch<WalletProviderAction>,
  walletProvider: Filecoin & { wallet: LedgerSubProvider }
) => {
  dispatch({ type: 'LEDGER_ESTABLISHING_CONNECTION_W_FILECOIN_APP' })
  try {
    const response = await walletProvider.wallet.getVersion()
    if (response.device_locked) {
      dispatch({ type: 'LEDGER_LOCKED' })
      return false
    }

    if (badVersion({ ...response })) {
      dispatch({ type: 'LEDGER_BAD_VERSION' })
      return false
    }

    dispatch({ type: 'LEDGER_UNLOCKED' })
    dispatch({ type: 'LEDGER_FILECOIN_APP_OPEN' })
    return true
  } catch (err) {
    if (
      err?.message.toLowerCase().includes('transporterror: invalid channel')
    ) {
      dispatch({ type: 'LEDGER_REPLUG' })
    } else if (
      err?.message.toLowerCase().includes('ledger device locked or busy')
    ) {
      dispatch({ type: 'LEDGER_BUSY' })
    } else if (
      err?.message.toLowerCase().includes('app does not seem to be open')
    ) {
      dispatch({ type: 'LEDGER_FILECOIN_APP_NOT_OPEN' })
    } else if (err.message && err?.message.toLowerCase().includes('28161')) {
      dispatch({ type: 'LEDGER_FILECOIN_APP_NOT_OPEN' })
    } else {
      dispatch({ type: 'LEDGER_REPLUG' })
      reportError(6, false, err.message, err.stack)
    }
    return false
  }
}
