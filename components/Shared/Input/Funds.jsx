import React, { forwardRef, useRef, useState } from 'react'
import { func, string, bool, oneOfType } from 'prop-types'
import { FilecoinNumber, BigNumber } from '@openworklabs/filecoin-number'

import Box from '../Box'
import { RawNumberInput, DenomTag } from './Number'
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
  if (BigNumber.isBigNumber(number))
    return new BigNumber(number.toFixed(2, 1)).toString()
  return number
}

const Funds = forwardRef(
  (
    {
      onAmountChange,
      balance,
      error,
      setError,
      estimatedTransactionFee,
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
      amount && amount > 0 && converter && !converterError
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

      if (new BigNumber(val).toString() === 'NaN') return false

      if (
        val
          .plus(estimatedTransactionFee.toFil())
          .isGreaterThanOrEqualTo(balance)
      ) {
        // user enters a value that's greater than their balance - gas limit
        setError("The amount must be smaller than this account's balance")
        return false
      }

      return true
    }

    const onTimerFil = async val => {
      const fil = new FilecoinNumber(val, 'fil')
      const fiatAmnt = !converterError && converter.fromFIL(fil)
      const validBalance = checkBalance(fil)
      if (validBalance) {
        setFiatAmount(fiatAmnt)
        onAmountChange(fil)
      } else {
        onAmountChange(new FilecoinNumber('0', 'fil'))
      }
    }

    const onTimerFiat = async val => {
      const fiat = new BigNumber(val)
      const fil =
        !converterError && new FilecoinNumber(converter.toFIL(fiat), 'fil')
      checkBalance(fil)
      setFilAmount(fil)
      onAmountChange(fil)
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
      else if (new BigNumber(e.target.value).isLessThan(1)) {
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
      else if (new FilecoinNumber(e.target.value, 'fil').isLessThan(1)) {
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
        borderColor='input.border'
        ref={ref}
        {...props}
      >
        <Box
          display='flex'
          alignItems='center'
          justifyContent='flex-start'
          flexGrow='1'
          width='100%'
          maxWidth={10}
          textAlign='center'
          color='input.border'
          bg={error && 'input.background.invalid'}
          px={2}
          mr={2}
          borderRadius={2}
        >
          {error ? (
            <Text color='core.nearblack' textAlign='center' px={2}>
              {error}
            </Text>
          ) : (
            <Label color='core.nearblack'>Amount</Label>
          )}
        </Box>
        <Box display='inline-block' width='100%'>
          <Box
            position='relative'
            display='flex'
            height='80px'
            width='100%'
            borderBottom={1}
            borderColor='background.screen'
            borderTopLeftRadius={2}
          >
            <Box
              position='absolute'
              left='-24px'
              bottom='-24px'
              display='flex'
              alignItems='center'
              justifyContent='center'
              backgroundColor='core.white'
              borderRadius={5}
              size={6}
              fontSize={5}
              fontFamily='sansSerif'
              paddingBottom='4px'
              zIndex='2'
            >
              {'\u003D'}
            </Box>

            <RawNumberInput
              onFocus={() => {
                setError('')
              }}
              onBlur={async () => {
                clearTimeout(timeout.current)
                onTimerFil(filAmount)
              }}
              height='100%'
              fontSize={5}
              borderTopLeftRadius={2}
              onChange={onFilChange}
              value={formatFilValue(filAmount)}
              placeholder='0'
              type='number'
              step={new FilecoinNumber('1', 'attofil').toFil()}
              disabled={disabled}
              valid={valid && !!formatFilValue(filAmount)}
              {...props}
            />
            <DenomTag
              top='0px'
              left='0px'
              borderTopRightRadius={2}
              valid={valid && !!formatFilValue(filAmount)}
              disabled={disabled}
            >
              FIL
            </DenomTag>
          </Box>
          <Box
            position='relative'
            display='flex'
            height='80px'
            borderRadius={2}
          >
            <RawNumberInput
              onFocus={() => {
                setError('')
              }}
              onBlur={async () => {
                clearTimeout(timeout.current)
                onTimerFiat(fiatAmount)
              }}
              height='100%'
              fontSize={5}
              borderBottomLeftRadius={2}
              onChange={onFiatChange}
              value={formatFiatValue(fiatAmount)}
              placeholder={converterError ? 'Error fetching amount' : '0'}
              type='number'
              step={new FilecoinNumber('1', 'attofil').toFil()}
              min='0'
              valid={valid && !!formatFiatValue(fiatAmount)}
              disabled={!!(disabled || converterError)}
            />
            <DenomTag
              top='0px'
              left='0px'
              valid={valid && !!formatFiatValue(fiatAmount)}
              disabled={!!(disabled || converterError)}
              borderBottomRightRadius={2}
            >
              USD
            </DenomTag>
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
  estimatedTransactionFee: FILECOIN_NUMBER_PROP,
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
  estimatedTransactionFee: new FilecoinNumber('1000', 'attofil')
}

export default Funds
