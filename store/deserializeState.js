import cloneDeep from 'lodash.clonedeep'
import { FilecoinNumber } from '@glif/filecoin-number'

const deserializeState = (state) => {
  const newState = cloneDeep(state)
  newState.wallets = state.wallets.map((wallet) => ({
    ...wallet,
    balance: new FilecoinNumber(wallet.balance, 'fil')
  }))
  return newState
}

export default deserializeState
