import RpcClient from '@glif/filecoin-rpc-client'
import { PL_SIGNERS } from '../../constants'

export const msigPartlyOwnedByPL = signers => {
  const [signer0, signer1] = signers
  return PL_SIGNERS.has(signer0) || PL_SIGNERS.has(signer1)
}

export const pickPLSigner = signers => {
  return signers.filter(s => PL_SIGNERS.has(s))[0]
}

export const getMethod6SerializedParams = async (toAddr, params) => {
  const rclient = new RpcClient({
    apiAddress: 'http://44.242.154.242:28000/rpc/v0'
  })
  const res = await rclient.request('MpoolEncodeParams', toAddr, 6, params)
  return res
}
