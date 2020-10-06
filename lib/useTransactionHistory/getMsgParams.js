import LotusRPCEngine from '@glif/filecoin-rpc-client'
import { SEND, PROPOSE } from '../../constants'

const fetchParams = async (cid, deserialize) => {
  const rpc = new LotusRPCEngine({ apiAddress: process.env.LOTUS_NODE_JSONRPC })
  const msg = await rpc.request('ChainGetMessage', { '/': cid })
  const deserializedParams = deserialize(msg.Params, 'fil/1/multisig', 2)

  if (deserializedParams.method !== 0) {
    const deserializedInnerParams = deserialize(
      deserializedParams.params,
      'fil/1/multisig',
      deserializedParams.method
    )

    deserializedParams.params = deserializedInnerParams
  }

  return deserializedParams
}

export default (messages, deserialize) => {
  return Promise.all(
    messages.map(async m => {
      if (m.method === SEND) return m
      if (m.method === PROPOSE) {
        const p = await fetchParams(m.cid, deserialize)
        return { ...m, params: p }
      }
      return m
    })
  )
}
