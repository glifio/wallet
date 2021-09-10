import LotusRpcEngine from '@glif/filecoin-rpc-client'
import convertAddrToFPrefix from '../convertAddrToFPrefix'

export default async function(
  lotus: LotusRpcEngine,
  walletAddress: string,
  signers: string[]
): Promise<boolean> {
  let idAddress = ''

  try {
    idAddress = await lotus.request('StateLookupID', walletAddress, null)
  } catch (_) {
    // noop
  }

  return signers.some(signer => {
    if (signer[1] === '0')
      return convertAddrToFPrefix(signer) === convertAddrToFPrefix(idAddress)
    return convertAddrToFPrefix(signer) === convertAddrToFPrefix(walletAddress)
  })
}
