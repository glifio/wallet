import { BigNumber } from '@openworklabs/filecoin-number'

const makeFriendly = (bigNumber, denom) => {
  const stringifiedNumber = bigNumber.toFixed(0)
  let idx = Number(stringifiedNumber.length) % 3
  if (idx === 0) idx = 3
  const base = stringifiedNumber.slice(0, idx)
  const dangler = stringifiedNumber.slice(idx, idx + 1)
  return `${base}.${dangler}${denom}`
}

const addComparisonOperator = (endNum, originalNum) => {
  if (new BigNumber(endNum).isNaN()) return endNum
  if (new BigNumber(originalNum).isEqualTo(new BigNumber(endNum))) return endNum
  if (new BigNumber(originalNum).isLessThan(new BigNumber(endNum)))
    return `< ${endNum}`
  if (new BigNumber(originalNum).isGreaterThan(new BigNumber(endNum)))
    return endNum
}

export default (bigNumber, dp = 3, pretty = true) => {
  if (!bigNumber) throw new Error('No number passed to big number')
  if (!BigNumber.isBigNumber(bigNumber)) return bigNumber
  if (!pretty) return bigNumber.toString()
  if (bigNumber.isEqualTo(0)) return '0'
  if (bigNumber.toString() === 'NaN') {
    throw new Error('Number must be a valid number')
  }
  if (bigNumber.isLessThan(0)) throw new Error('Cannot have a negative balance')
  if (bigNumber.isGreaterThan(0) && bigNumber.isLessThanOrEqualTo(1)) {
    if (bigNumber.dp(dp, BigNumber.ROUND_HALF_DOWN).isEqualTo('0')) {
      let abbrev = '0.'
      for (let i = 0; i < dp - 1; i += 1) {
        abbrev += '0'
      }
      return addComparisonOperator(`${abbrev}1`, bigNumber)
    }

    return addComparisonOperator(
      bigNumber.dp(dp, BigNumber.ROUND_HALF_DOWN).toString(),
      bigNumber
    )
  }
  if (bigNumber.isGreaterThan(1) && bigNumber.isLessThanOrEqualTo(1000)) {
    return bigNumber.dp(dp, BigNumber.ROUND_HALF_DOWN).toString()
  }
  if (bigNumber.isGreaterThan(1000) && bigNumber.isLessThan(1000000)) {
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
  return '> 999.9B'
}
