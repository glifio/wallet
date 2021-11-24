import signingTools from '@zondax/filecoin-signing-tools/js'
import { SEND, PROPOSE, EXEC } from '../../constants'

const deserialize = async (params, method) => {
  try {
    const deserializedParams = signingTools.deserializeParams(
      params,
      'fil/2/multisig',
      method
    )
    if (deserializedParams.method !== 0) {
      try {
        const deserializedInnerParams = signingTools.deserializeParams(
          deserializedParams.params,
          'fil/2/multisig',
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

const deserializeConstructorParams = (params) => {
  const { constructor_params } = signingTools.deserializeParams(
    params,
    'fil/1/init',
    2
  )
  const constructorParams = signingTools.deserializeConstructorParams(
    constructor_params,
    'fil/2/multisig'
  )

  return constructorParams
}

const getMsgParams = (messages) => {
  return Promise.all(
    messages.map(async (m) => {
      let p = {}
      switch (m.method) {
        case SEND: {
          p = await deserialize(m.params, 2)
          break
        }
        case PROPOSE: {
          p = await deserialize(m.params, 2)
          break
        }
        case EXEC: {
          p = await deserializeConstructorParams(m.params)
          break
        }
        default: {
          p = {}
        }
      }

      return { ...m, params: p }
    })
  )
}

export default getMsgParams
