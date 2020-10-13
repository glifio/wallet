import { SEND, PROPOSE, EXEC } from '../../constants'

const deserializeParams = async (params, deserialize, method) => {
  try {
    const deserializedParams = deserialize(params, 'fil/1/multisig', method)
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
    return {}
  }
}

export default (messages, deserialize) => {
  return Promise.all(
    messages.map(async m => {
      if (m.method === SEND) return m
      if (m.method === PROPOSE) {
        const p = await deserializeParams(m.params, deserialize, 2)
        return { ...m, params: p }
      }
      if (m.method === EXEC) {
        const p = await deserializeParams(m.params, deserialize, 1)
        return { ...m, params: p }
      }
      return m
    })
  )
}
