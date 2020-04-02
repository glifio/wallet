import React, { forwardRef, useRef, useState } from 'react'
import { func, string, bool, oneOfType } from 'prop-types'
import { FilecoinNumber, BigNumber } from '@openworklabs/filecoin-number'

import Box from '../Box'
import { RawNumberInput } from './Number'
import { Text, Label } from '../Typography'
import { FILECOIN_NUMBER_PROP } from '../../../customPropTypes'
import noop from '../../../utils/noop'
import { useConverter } from '../../../lib/Converter'

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
      amount,
      ...props
    },
    ref
  ) => {
    const { converter, converterError } = useConverter()
    const initialFilAmount =
      amount && amount > 0 ? new FilecoinNumber(amount, 'attofil') : ''
    const initialFiatAmount =
      amount && amount > 0 && !converterError
        ? converter.fromFIL(new FilecoinNumber(amount, 'attofil').toFil())
        : ''

    const [filAmount, setFilAmount] = useState(initialFilAmount)
    const [fiatAmount, setFiatAmount] = useState(initialFiatAmount)
    const timeout = useRef()

    const checkBalance = val => {
      if (!val || new BigNumber(val).isEqualTo(0)) {
        setError('Please enter a valid amount.')
        return false
      }
      // user enters a value that's greater than their balance - gas limit
      if (val.plus(gasLimit.toFil()).isGreaterThanOrEqualTo(balance)) {
        setError("The amount must be smaller than this account's balance")
        return false
      }

      return true
    }

    const onTimerFil = async val => {
      const fiatAmnt = !converterError && converter.fromFIL(val)
      const validBalance = checkBalance(val)
      if (validBalance) {
        setFiatAmount(fiatAmnt)
        onAmountChange({ fil: val, fiat: fiatAmnt })
      } else {
        onAmountChange({
          fil: new FilecoinNumber('0', 'fil'),
          fiat: new BigNumber('0')
        })
      }
    }

    const onTimerFiat = async val => {
      const fil = !converterError && converter.toFIL(val)
      const validBalance = checkBalance(fil)
      if (validBalance) {
        setFilAmount(fil)
        onAmountChange({ fil, fiat: val })
      } else {
        onAmountChange({
          fil: new FilecoinNumber('0', 'fil'),
          fiat: new BigNumber('0')
        })
      }
    }

    const onFiatChange = e => {
      setError('')
      setFilAmount('')
      clearTimeout(timeout.current)

      // handle case where user deletes all values from text input
      if (!e.target.value) setFiatAmount('')
      // user entered non-numeric characters
      else if (e.target.value && new BigNumber(e.target.value).isNaN()) {
        setError('Must pass numbers only')
      }
      // when user is setting decimals
      else if (new BigNumber(e.target.value).isEqualTo(0)) {
        const { value } = e.target
        // use strings > big numbers
        setFiatAmount(value)
        timeout.current = setTimeout(() => onTimerFiat(value), 500)
      }
      // handle number change
      else {
        const { value } = e.target
        setFiatAmount(new BigNumber(value))
        timeout.current = setTimeout(
          () => onTimerFiat(new BigNumber(value)),
          500
        )
      }
    }

    const onFilChange = e => {
      setError('')
      setFiatAmount('')
      clearTimeout(timeout.current)

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
        const { value } = e.target
        // use strings > big numbers
        setFilAmount(value)
        timeout.current = setTimeout(() => onTimerFil(value), 500)
      }

      // handle number change
      else {
        const { value } = e.target
        setFilAmount(new FilecoinNumber(value, 'fil'))
        timeout.current = setTimeout(
          () => onTimerFil(new FilecoinNumber(value, 'fil')),
          500
        )
      }
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
          width='100%'
          maxWidth={11}
          p={3}
          textAlign='center'
          borderColor='input.border'
          bg={error && 'input.background.invalid'}
        >
          {error ? <Text>{error}</Text> : <Label>Amount</Label>}
        </Box>
        <Box display='inline-block' width='100%'>
          <Box position='relative' display='block' height='80px' width='100%'>
            <Box
              position='absolute'
              left='-24px'
              bottom='-24px'
              display='flex'
              alignItems='center'
              justifyContent='center'
              backgroundColor='core.white'
              border={1}
              borderColor='input.border'
              borderRadius={5}
              size={6}
              fontSize={5}
              fontFamily='sansSerif'
              paddingBottom='4px'
            >
              {'\u003D'}
            </Box>

            <RawNumberInput
              onFocus={() => {
                setError('')
              }}
              onBlur={async () => {
                clearTimeout(timeout.current)
                const validBalance = checkBalance(filAmount)
                if (validBalance) {
                  const fiatAmnt =
                    !converterError && converter.fromFIL(filAmount)
                  setFiatAmount(fiatAmnt)
                  onAmountChange({ fil: filAmount, fiat: fiatAmnt })
                } else {
                  onAmountChange({
                    fil: new FilecoinNumber('0', 'fil'),
                    fiat: new BigNumber('0')
                  })
                }
              }}
              height='100%'
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
            borderTop={1}
            borderColor='input.border'
          >
            <RawNumberInput
              onFocus={() => {
                setError('')
              }}
              onBlur={async () => {
                clearTimeout(timeout.current)
                const fil = !converterError && converter.toFIL(fiatAmount)
                const validBalance = checkBalance(fil)
                if (validBalance) {
                  setFilAmount(fil)
                  onAmountChange({ fil, fiat: fiatAmount })
                } else {
                  onAmountChange({
                    fil: new FilecoinNumber('0', 'fil'),
                    fiat: new BigNumber('0')
                  })
                }
              }}
              height='100%'
              onChange={onFiatChange}
              value={formatFiatValue(fiatAmount)}
              placeholder={
                converterError ? 'Error fetching USD amount' : '0 USD'
              }
              type='number'
              step={new FilecoinNumber('1', 'attofil').toFil()}
              min='0'
              valid={valid}
              disabled={disabled || converterError}
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
  gasLimit: FILECOIN_NUMBER_PROP,
  disabled: bool,
  valid: bool,
  amount: oneOfType([string, FILECOIN_NUMBER_PROP])
}

Funds.defaultProps = {
  error: '',
  disabled: false,
  setError: noop,
  onAmountChange: noop,
  amount: '',
  gasLimit: new FilecoinNumber('1000', 'attofil')
}

export default Funds
