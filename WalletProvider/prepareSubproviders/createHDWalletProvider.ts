import { Network as CoinType } from '@glif/filecoin-address'
import { WalletSubProvider } from '@glif/filecoin-wallet-provider'
import {
  Message,
  SignedLotusMessage,
  LotusMessage
} from '@glif/filecoin-message'
import createPath, { coinTypeCode } from '../../utils/createPath'
import { HD_WALLET } from '../../constants'

const createHDWalletProvider = (rustModule) => {
  return (mnemonic: string): WalletSubProvider => {
    // here we close over the private variables, so they aren't accessible to the outside world
    const MNEMONIC = mnemonic
    let accountToPath = {}
    return {
      getAccounts: async (
        nStart = 0,
        nEnd = 5,
        coinType = CoinType.MAIN
      ): Promise<string[]> => {
        const accounts = []
        for (let i = nStart; i < nEnd; i += 1) {
          const path = createPath(coinTypeCode(coinType), i)
          const account = rustModule.keyDerive(MNEMONIC, path, '').address
          accounts.push(account)
          accountToPath[account] = path
        }
        return accounts
      },

      sign: async (
        from: string,
        message: LotusMessage
      ): Promise<SignedLotusMessage> => {
        if (from !== message.From) throw new Error('From address mismatch')
        const path = accountToPath[from]
        const msg = Message.fromLotusType(message)
        const { private_hexstring } = rustModule.keyDerive(MNEMONIC, path, '')
        const { signature } = rustModule.transactionSign(
          msg.toZondaxType(),
          Buffer.from(private_hexstring, 'hex').toString('base64')
        ) as { signature: { data: string; type: number } }

        return {
          Message: message,
          Signature: {
            Type: signature.type,
            Data: signature.data
          }
        }
      },

      type: HD_WALLET
    }
  }
}

export default createHDWalletProvider
