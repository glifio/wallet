import { LEDGER } from '../../constants'

export default async (provider, selectedWallet, message, walletType) => {
  if (walletType === LEDGER) {
    const serializedMessage = await message.serialize()
    const signature = await provider.wallet.sign(
      selectedWallet.path,
      serializedMessage
    )
    return signature
  }
  throw new Error('Unsupported wallet type')
}
