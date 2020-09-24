export default async (lotus, walletAddress, signers) => {
  return true
  let idAddress = ''

  try {
    idAddress = await lotus.request('StateLookupID', walletAddress, null)
  } catch (_) {
    // noop
  }

  return signers.some(signer => {
    if (signer[1] === '0') return signer === idAddress
    return signer === walletAddress
  })
}
