import { FilecoinNumber } from '@glif/filecoin-number'
import { MAINNET_PATH_CODE, TESTNET_PATH_CODE } from '../../constants'

type Wallet = {
  path: string
  balance: FilecoinNumber
  address: string
}

const sortByIndex = (w1: Wallet, w2: Wallet) =>
  Number(w1.path.split('/')[5]) - Number(w2.path.split('/')[5])

const sortAndRemoveDups = (walletsInRdx: Wallet[], wallets: Wallet[]) => {
  const seenWallets = new Set()
  const uniqueWallets = [...walletsInRdx, ...wallets].filter((wallet) => {
    if (!seenWallets.has(wallet.address)) {
      seenWallets.add(wallet.address)
      return true
    }
    return false
  })

  const [supportedWallets, legacyWallets] = uniqueWallets.reduce(
    (walletSplit: [Wallet[], Wallet[]], wallet) => {
      const networkCode = wallet.path.split('/')[2]
      if (!networkCode) {
        walletSplit[0].push(wallet)
      } else if (networkCode.includes(MAINNET_PATH_CODE.toString())) {
        walletSplit[0].push(wallet)
      } else if (networkCode.includes(TESTNET_PATH_CODE.toString())) {
        walletSplit[1].push(wallet)
      } else {
        // this should only get hit when new network codes get added
        walletSplit[0].push(wallet)
      }

      return walletSplit
    },
    [[], []]
  )
  supportedWallets.sort(sortByIndex)
  legacyWallets.sort(sortByIndex)

  return [...supportedWallets, ...legacyWallets]
}

export default sortAndRemoveDups
