import {
  createHash,
  isValidInvestorId,
  encodeInvestorValsForCoinList,
  decodeInvestorValsForCoinList
} from '.'

describe('investorUtils', () => {
  describe('createHash', () => {
    test('it hashes properly according to predefined values', () => {
      const val = 'Qmcv45ZPc3oEwsbcHMRcs3AG59Rp8EUFr6Dm512KUswpRA'

      expect(createHash(val)).toBe(
        'fb97c41fb9a1e8fce8ed5386b2201abecbf5d90c6fa5b1a9f246034f9ba4c9a1'
      )
    })
  })

  describe('isValidInvestorId', () => {
    test('it properly validates a valid investor ID', () => {
      const investorId = 'Qmcv45ZPc3oEwsbcHMRcs3AG59Rp8EUFr6Dm512KUswpRA'
      expect(isValidInvestorId(investorId)).toBe(true)
    })

    test('it properly invalidates an investor ID', () => {
      const investorId = 'Qmcv45ZPc3oEwsbcHMRcs3AG59Rp8EUFr6dm512KUswpRA'
      expect(isValidInvestorId(investorId)).toBe(false)
    })
  })

  describe('encoding and decoding investor information', () => {
    const address = 't137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy'
    const investorId = 'Qmcv45ZPc3oEwsbcHMRcs3AG59Rp8EUFr6dm512KUswpRA'
    describe('encodeInvestorValsForCoinList', () => {
      test('it takes a list of vals, comma delineates them, hashes them, concats the hash with the string, and hexes the result', () => {
        expect(encodeInvestorValsForCoinList(address, investorId)).toBe(
          '74313337736a646267756e6c6f6937636f756979346c356e63377064366b326a6d71333276697a70792c516d637634355a5063336f4577736263484d52637333414735395270384555467236646d3531324b5573777052413a62343638626630343039376437373064376561643533336639663139653362383331356331663765316137333231656431616434336565373361343934333039'
        )
      })
    })

    describe('decodeInvestorValsForCoinList', () => {
      test('it decodes a list of vals and validates the hash', () => {
        expect(
          decodeInvestorValsForCoinList(
            '74313337736a646267756e6c6f6937636f756979346c356e63377064366b326a6d71333276697a70792c516d637634355a5063336f4577736263484d52637333414735395270384555467236646d3531324b5573777052413a62343638626630343039376437373064376561643533336639663139653362383331356331663765316137333231656431616434336565373361343934333039'
          )[0]
        ).toBe(address)

        expect(
          decodeInvestorValsForCoinList(
            '74313337736a646267756e6c6f6937636f756979346c356e63377064366b326a6d71333276697a70792c516d637634355a5063336f4577736263484d52637333414735395270384555467236646d3531324b5573777052413a62343638626630343039376437373064376561643533336639663139653362383331356331663765316137333231656431616434336565373361343934333039'
          )[1]
        ).toBe(investorId)
      })
    })
  })
})
