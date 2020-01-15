import Filecoin, {
  LedgerProvider
} from '@openworklabs/filecoin-wallet-provider'

import {
  error,
  walletList,
  createWalletProvider,
  clearError
} from '../../store/actions'
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
import createTransport from './transport'

export default async (
  walletProvider,
  setProgress,
  dispatchLocal,
  dispatchRdx
) => {
  dispatchLocal({ type: USER_INITIATED_IMPORT })
  let transport
  try {
    if (!transport) {
      transport = await createTransport()
    }
    dispatchLocal({ type: LEDGER_CONNECTED })
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
  try {
    if (!provider) {
      provider = new Filecoin(new LedgerProvider(transport), {
        token: process.env.REACT_APP_LOTUS_JWT_TOKEN
      })
    }
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

  try {
    const filAddresses = await provider.wallet.getAccounts(0, 1)
    const wallets = await Promise.all(
      filAddresses.map(async address => {
        const balance = await provider.getBalance(address)
        return {
          balance,
          address
        }
      })
    )
    dispatchRdx(walletList(wallets))
    dispatchRdx(clearError())
    setProgress(2)
  } catch (err) {
    dispatchRdx(error(err))
  }
}
