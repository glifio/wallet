import { useRef } from 'react'
import Filecoin from '@glif/filecoin-wallet-provider'
import LotusRPCEngine from '@glif/filecoin-rpc-client'
import { LotusMessage, Message } from '@glif/filecoin-message'
import useSWR from 'swr'

import useTransactionHistory from './useTransactionHistory'
import converAddrToFPrefix from '../utils/convertAddrToFPrefix'
import { FilecoinNumber } from '@glif/filecoin-number'

const lCli = new LotusRPCEngine({
  apiAddress: process.env.LOTUS_NODE_JSONRPC
})

export default function useReplacedMessageWithSpeed(
  messageCid: string,
  address: string,
  provider: Filecoin
) {
  const { pending } = useTransactionHistory(address)
  const { current } = useRef(pending.find(({ cid }) => cid === messageCid))
  const { data, error, isValidating } = useSWR(
    [messageCid, address],
    async () => {
      const res = (await lCli.request('ChainGetMessage', {
        '/': messageCid
      })) as LotusMessage
      if (converAddrToFPrefix(res.To) !== converAddrToFPrefix(current.to))
        return null
      if (converAddrToFPrefix(res.From) !== converAddrToFPrefix(current.from))
        return null
      if (res.Nonce !== current.nonce) return null

      const msg = new Message({
        to: converAddrToFPrefix(res.To),
        from: converAddrToFPrefix(res.From),
        nonce: res.Nonce,
        value: res.Value,
        params: res.Params || '',
        gasFeeCap: res.GasFeeCap,
        gasLimit: res.GasLimit,
        gasPremium: res.GasPremium,
        method: res.Method
      })

      const {
        gasFeeCap,
        gasLimit,
        gasPremium
      } = await provider.getReplaceMessageGasParams(msg.toLotusType())

      const messageToReplace = new Message({
        ...msg.toSerializeableType(),
        gasFeeCap,
        gasLimit,
        gasPremium
      })

      const { maxFee } = await provider.gasEstimateMaxFee(
        messageToReplace.toLotusType()
      )

      return { maxFee, messageToReplace }
    }
  )
  if (!data)
    return {
      messageWithSpeed: null,
      maxFee: new FilecoinNumber('0', 'fil'),
      error,
      loading: isValidating,
      originalMessage: current
    }

  return {
    messageWithSpeed: data.messageToReplace,
    maxFee: data.maxFee,
    error,
    loading: isValidating
  }
}
