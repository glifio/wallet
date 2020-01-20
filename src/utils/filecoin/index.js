import BigNumber from 'bignumber.js'

/**
 *
 * @param {string} filecoin - a javascript string in FIL denomination
 * @returns {BigNumber} - a javascript bug number representing AttoFil denomination
 */
export const toAttoFil = fil => {
  const bigNumber = new BigNumber(fil)
  return bigNumber.shiftedBy(18).toString()
}

/**
 *
 * @param {string} attoFil - a javascript big number object in AttoFil denomination
 * @returns {BigNumber} - a javascript bug number representing Fil denomination
 */
export const toFil = attoFil => {
  const bigNumber = new BigNumber(attoFil)
  return bigNumber.shiftedBy(-18).toString()
}
