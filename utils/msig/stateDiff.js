export default (prevState, nextState) => {
  const balanceChanged =
    prevState.Balance.toString() !== nextState.Balance.toString()
  const availBalanceChanged =
    prevState.AvailableBalance.toString() !==
    nextState.AvailableBalance.toString()

  const signersChanged = prevState.Signers.some((signer, i) => {
    return nextState.Signers[i] !== signer
  })

  return balanceChanged || availBalanceChanged || signersChanged
}
