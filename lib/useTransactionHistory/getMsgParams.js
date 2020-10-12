import LotusRPCEngine from '@glif/filecoin-rpc-client'
import { SEND, PROPOSE } from '../../constants'

const fetchParams = async (cid, deserialize) => {
  try {
    const rpc = new LotusRPCEngine({
      apiAddress: process.env.LOTUS_NODE_JSONRPC
    })
    const msg = await rpc.request('ChainGetMessage', { '/': cid })
    const deserializedParams = deserialize(msg.Params, 'fil/1/multisig', 2)
    if (deserializedParams.method !== 0) {
      try {
        const deserializedInnerParams = deserialize(
          deserializedParams.params,
          'fil/1/multisig',
          deserializedParams.method
        )

        deserializedParams.params = deserializedInnerParams
      } catch (_) {
        // noop - the UI handles the case where we dont know the params
      }
    }

    return deserializedParams
  } catch (_) {
    // here if we have trouble decoding params, just show it as "unrecognized" in the UI
    return ''
  }
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
