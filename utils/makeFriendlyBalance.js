import { BigNumber } from '@openworklabs/filecoin-number'

const makeFriendly = (bigNumber, denom) => {
  const stringifiedNumber = bigNumber.toString()
  const base = stringifiedNumber.slice(0, 3)
  const dangler = stringifiedNumber.slice(3, 4)
  return `${base}.${dangler}${denom}`
}

export default (bigNumber, dp = 3) => {
  if (bigNumber.isLessThan(0)) throw new Error('Cannot have a negative balance')
  if (bigNumber.isEqualTo(0)) return '0'
  if (bigNumber.isGreaterThan(0) && bigNumber.isLessThan(1000)) {
    // console.log(bigNumber.dp(3, BigNumber.ROUND_DOWN).toString())
    return bigNumber.dp(dp, BigNumber.ROUND_DOWN).toString()
  }
  if (bigNumber.isGreaterThanOrEqualTo(1000) && bigNumber.isLessThan(1000000)) {
    return makeFriendly(bigNumber, 'K')
  }
  if (
    bigNumber.isGreaterThanOrEqualTo(1000000) &&
    bigNumber.isLessThan(1000000000)
  ) {
    return makeFriendly(bigNumber, 'M')
  }
  if (
    bigNumber.isGreaterThanOrEqualTo(1000000000) &&
    bigNumber.isLessThan(1000000000000)
  ) {
    return makeFriendly(bigNumber, 'B')
  }
  return bigNumber.toString()
}
