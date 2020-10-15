import convertAddrToFPrefix from '../convertAddrToFPrefix'

export default async (lotus, walletAddress, signers) => {
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
