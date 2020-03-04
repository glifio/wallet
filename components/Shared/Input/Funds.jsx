import React, { forwardRef, useState } from 'react'
import { func, string, bool } from 'prop-types'
import { FilecoinNumber, BigNumber } from '@openworklabs/filecoin-number'

import Box from '../Box'
import NumberInput from './Number'
import { Text, Label } from '../Typography'
import { IconApproximatelyEquals } from '../Icons/index'
import { FILECOIN_NUMBER_PROP } from '../../../customPropTypes'

const formatFilValue = number => {
  if (!number) return ''
  if (FilecoinNumber.isBigNumber(number)) return number.toFil()
  return number
}

const formatFiatValue = number => {
  if (!number) return ''
  if (BigNumber.isBigNumber(number)) return number.toString()
  return number
}

const toUSD = async amount => new FilecoinNumber(amount, 'fil').multipliedBy(5)
const fromUSD = async amount =>
  new FilecoinNumber(new BigNumber(amount).dividedBy(5), 'fil')

const Funds = forwardRef(
  (
    {
      onAmountChange,
      balance,
      error,
      setError,
      gasLimit,
      disabled,
      valid,
      ...props
    },
    ref
  ) => {
    const [fiatAmount, setFiatAmount] = useState('')
    const [filAmount, setFilAmount] = useState('')

    const onFiatChange = e => {
      setError('')

      // handle case where user deletes all values from text input
      if (!e.target.value) setFiatAmount('')
      // user entered non-numeric characters
      else if (e.target.value && new BigNumber(e.target.value).isNaN()) {
        setError('Must pass numbers only')
      }
      // when user is setting decimals
      else if (new BigNumber(e.target.value).isEqualTo(0)) {
        // dont use big numbers
        setFiatAmount(e.target.value)
      }
      // handle number change
      else setFiatAmount(new BigNumber(e.target.value))
    }

    const onFilChange = e => {
      setError('')
      // handle case where user deletes all values from text input
      if (!e.target.value) setFilAmount('')
      // user entered non-numeric characters
      else if (
        e.target.value &&
        new FilecoinNumber(e.target.value, 'fil').isNaN()
      ) {
        setError('Must pass numbers only')
      }
      // when user is setting decimals
      else if (new FilecoinNumber(e.target.value, 'fil').isEqualTo(0)) {
        // dont use big numbers
        setFilAmount(e.target.value)
      }

      // handle number change
      else setFilAmount(new FilecoinNumber(e.target.value, 'fil'))
    }

    const checkBalance = amount => {
      if (!amount || new BigNumber(amount).isEqualTo(0)) {
        setError('Please enter a valid amount.')
        return false
      }
      // user enters a value that's greater than their balance - gas limit
      if (
        amount
          .plus(new FilecoinNumber(gasLimit, 'attofil'))
          .isGreaterThanOrEqualTo(balance)
      ) {
        setError("The amount must be smaller than this account's balance")
        return false
      }

      return true
    }

    return (
      <Box
        position='relative'
        display='flex'
        minHeight='160px'
        border={1}
        borderRadius={1}
        borderColor='input.border'
        mt={3}
        ref={ref}
        {...props}
      >
        <Box
          display='flex'
          alignItems='center'
          justifyContent='center'
          flexGrow='1'
          width='280px'
          textAlign='center'
          borderRight={1}
          borderColor='input.border'
        >
          {error ? <Text>{error}</Text> : <Label>Amount</Label>}
        </Box>
        <Box display='inline-block' width='280px'>
          <Box position='relative' display='block' height='80px' width='100%'>
            <IconApproximatelyEquals
              position='absolute'
              left='-24px'
              bottom='-42px'
              size={7}
            />

            <NumberInput
              onFocus={() => {
                setError('')
                setFiatAmount('')
              }}
              onBlur={async () => {
                const validBalance = checkBalance(filAmount)
                if (validBalance) {
                  const fiatAmnt = await toUSD(filAmount)
                  setFiatAmount(fiatAmnt)
                  onAmountChange({ fil: filAmount, fiat: fiatAmnt })
                }
              }}
              height='100%'
              width='100%'
              border='0'
              onChange={onFilChange}
              value={formatFilValue(filAmount)}
              placeholder='0 FIL'
              type='number'
              step={new FilecoinNumber('1', 'attofil').toFil()}
              disabled={disabled}
              valid={valid}
              {...props}
            />
          </Box>
          <Box
            display='block'
            height='80px'
            width='100%'
            borderTop={1}
            borderColor='input.border'
          >
            <NumberInput
              onFocus={() => {
                setError('')
                setFilAmount('')
              }}
              onBlur={async () => {
                const fiatAmnt = await fromUSD(fiatAmount)
                const validBalance = checkBalance(fiatAmnt)
                if (validBalance) {
                  setFilAmount(fiatAmnt)
                  onAmountChange({ fil: fiatAmnt, fiat: fiatAmount })
                }
              }}
              height='100%'
              width='100%'
              border='0'
              onChange={onFiatChange}
              value={formatFiatValue(fiatAmount)}
              placeholder='0 USD'
              type='number'
              step={new FilecoinNumber('1', 'attofil').toFil()}
              min='0'
              valid={valid}
              disabled={disabled}
            />
          </Box>
        </Box>
      </Box>
    )
  }
)

Funds.propTypes = {
  /**
   * A function that will return the fiat and FILECOIN denominated amounts
   * entered in the Funds input (in a BigNumber and FilecoinNumber instance)
   * @returns {Object} - { fiat: BigNumber, fil: FilecoinNumber }
   */
  onAmountChange: func,
  /**
   * Balance of account sending the transaction
   */
  balance: FILECOIN_NUMBER_PROP,
  /**
   * A string that represents the error message to display
   */
  error: string,
  /**
   * A setter to set the error when errors occur
   */
  setError: func,
  /**
   * Gas limit selected by user (to make sure we dont go over the user's balance)
   */
  gasLimit: string,
  disabled: bool,
  valid: bool
}

Funds.defaultProps = {
  error: '',
  gasLimit: '1000',
  disabled: false
}

export default Funds
