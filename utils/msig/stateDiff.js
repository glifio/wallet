import isequal from 'lodash.isequal'

const stateDiff = (prevState, nextState) => {
  const balanceChanged =
    prevState.Balance.toString() !== nextState.Balance.toString()
  const availBalanceChanged =
    prevState.AvailableBalance.toString() !==
    nextState.AvailableBalance.toString()

  const signersChanged = prevState.Signers.some(
    (signer, i) => !isequal(signer, nextState.Signers[i])
  )

  return balanceChanged || availBalanceChanged || signersChanged
}

export default stateDiff
