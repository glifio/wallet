import cloneDeep from 'lodash.clonedeep'
import { FilecoinNumber } from '@openworklabs/filecoin-number'

export default state => {
  const newState = cloneDeep(state)
  newState.wallets = state.wallets.map(wallet => ({
    ...wallet,
    balance: new FilecoinNumber(wallet.balance, 'fil')
  }))
  return newState
}
