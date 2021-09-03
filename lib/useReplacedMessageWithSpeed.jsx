import { useRef } from 'react'
import LotusRPCEngine from '@glif/filecoin-rpc-client'
import { Message } from '@glif/filecoin-message'
import useSWR from 'swr'

import useTransactionHistory from './useTransactionHistory'
import converAddrToFPrefix from '../utils/convertAddrToFPrefix'

const lCli = new LotusRPCEngine({
  apiAddress: process.env.LOTUS_NODE_JSONRPC
})

export default function useReplacedMessageWithSpeed(
  messageCid,
  address,
  provider
) {
  const { pending } = useTransactionHistory(address)
  const { current } = useRef(pending.find(({ cid }) => cid === messageCid))
  const { data, error, isValidating } = useSWR(
    [messageCid, address],
    async () => {
      const res = await lCli.request('ChainGetMessage', {
        '/': messageCid
      })
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
      } = await provider.getMinSpedUpGasParams(msg.toLotusType())

      return new Message({
        ...msg.toSerializeableType(),
        gasFeeCap,
        gasLimit,
        gasPremium
      })
    }
  )
  if (!data)
    return {
      messageWithSpeed: null,
      error,
      loading: isValidating,
      originalMessage: current
    }

  return { messageWithSpeed: data, error, loading: isValidating }
}
