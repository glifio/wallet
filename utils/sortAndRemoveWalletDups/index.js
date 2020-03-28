export default (walletsInRdx, wallets) => {
  const seenWallets = new Set()
  return [...walletsInRdx, ...wallets]
    .filter(wallet => {
      if (!seenWallets.has(wallet.address)) {
        seenWallets.add(wallet.address)
        return true
      }
      return false
    })
    .sort((a, b) => a.path.split('/')[5] - b.path.split('/')[5])
}
