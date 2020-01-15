import { LEDGER } from '../../constants'

export default async (provider, selectedWallet, message, walletType) => {
  if (walletType === LEDGER) {
    const { signature, error_message } = await provider.wallet.sign(
      selectedWallet.path,
      message.encode()
    )

    if (error_message.toLowerCase() === 'no errors') return signature
    throw new Error(error_message)
  }
  throw new Error('Unsupported wallet type')
}
