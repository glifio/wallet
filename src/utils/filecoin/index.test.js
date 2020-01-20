import BigNumber from 'bignumber.js'
import { toAttoFil, toFil } from './'

test('converts AttoFil denomination to Fil', () => {
  expect(toFil(new BigNumber('5000000000000000'))).toBe('0.005')
  expect(toFil('5000000000000000')).toBe('0.005')
})

test('converts Fil denomination to AttoFil', () => {
  expect(toAttoFil(new BigNumber('0.005'))).toBe('5000000000000000')
  expect(toAttoFil('.005')).toBe('5000000000000000')
})
