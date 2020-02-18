import { SINGLE_KEY } from '../constants'

export default async (network = 't', walletProvider) => {
  const [defaultAddress] = await walletProvider.wallet.getAccounts(
    0,
    1,
    network
  )
  const balance = await walletProvider.getBalance(defaultAddress)
  const networkDerivationPath = network === 'f' ? 461 : 1
  return {
    balance,
    address: defaultAddress,
    path:
      walletProvider.type === SINGLE_KEY
        ? []
        : [44, networkDerivationPath, 5, 0, 0]
  }
}
