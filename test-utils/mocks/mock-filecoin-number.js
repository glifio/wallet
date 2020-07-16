const BigNumber = require('bignumber.js')

export const mocks = {
  cacheConversionRate: jest.fn().mockImplementation(() => {
    return Promise.resolve()
  }),
  toFIL: jest.fn().mockImplementation(amount => {
    return new FilecoinNumber(amount, 'fil').dividedBy(5)
  }),
  fromFIL: jest.fn().mockImplementation(amount => {
    return new FilecoinNumber(amount, 'fil').multipliedBy(5)
  })
}

class MockConverter {
  cacheConversionRate = mocks.cacheConversionRate
  toFIL = mocks.toFIL
  fromFIL = mocks.fromFIL
}

// not sure how we want to configure rounding for this
BigNumber.set({ ROUNDING_MODE: BigNumber.ROUND_HALF_DOWN })
BigNumber.config({ EXPONENTIAL_AT: [-19, 20] })

// stores filecoin numbers in denominations of Fil, not AttoFil
class FilecoinNumber extends BigNumber {
  constructor(amount, denom) {
    if (!denom)
      throw new Error('No Filecoin denomination passed in constructor.')
    const formattedDenom = denom.toLowerCase()
    if (formattedDenom !== 'fil' && formattedDenom !== 'attofil')
      throw new Error('Unsupported denomination passed in constructor.')
    if (formattedDenom === 'attofil') {
      super(new BigNumber(amount).shiftedBy(-18))
    } else {
      super(amount)
    }
  }

  toFil = () => this.toString()

  toAttoFil = () => this.shiftedBy(18).toFixed(0, 1)
}

module.exports = { Converter: MockConverter, FilecoinNumber, mocks, BigNumber }
