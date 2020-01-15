import { LEDGER } from '../../constants'

export default async (provider, selectedWallet, message, walletType) => {
  if (walletType === LEDGER) {
    const { signature } = await provider.wallet.sign(
      selectedWallet.path,
      message.encode()
    )
    return signature
  }
  throw new Error('Unsupported wallet type')
}
