import React, { forwardRef, useRef, useState } from 'react'
import { func, string, bool } from 'prop-types'
import { FilecoinNumber, BigNumber } from '@openworklabs/filecoin-number'

import Box from '../Box'
import { RawNumberInput } from './Number'
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
const fromUSD = async amount => {
  if (!amount) return new FilecoinNumber('0', 'fil')
  return new FilecoinNumber(new BigNumber(amount).dividedBy(5), 'fil')
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
      ...props
    },
    ref
  ) => {
    const [fiatAmount, setFiatAmount] = useState('')
    const [filAmount, setFilAmount] = useState('')

    const timeout = useRef()

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

    const onTimerFil = async amount => {
      const fiatAmnt = await toUSD(amount)
      const validBalance = checkBalance(amount)
      if (validBalance) {
        setFiatAmount(fiatAmnt)
        onAmountChange({ fil: amount, fiat: fiatAmnt })
      } else {
        onAmountChange({
          fil: new FilecoinNumber('0', 'fil'),
          fiat: new BigNumber('0')
        })
      }
    }

    const onTimerFiat = async amount => {
      const fil = await fromUSD(amount)
      const validBalance = checkBalance(amount)
      if (validBalance) {
        setFilAmount(fil)
        onAmountChange({ fil, fiat: amount })
      } else {
        onAmountChange({
          fil: new FilecoinNumber('0', 'fil'),
          fiat: new BigNumber('0')
        })
      }
    }

    const onFiatChange = e => {
      setError('')
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
          textAlign='center'
          borderRight={1}
          borderColor='input.border'
          bg={error && 'input.background.invalid'}
        >
          {error ? <Text>{error}</Text> : <Label>Amount</Label>}
        </Box>
        <Box display='inline-block' width='100%'>
          <Box position='relative' display='block' height='80px' width='100%'>
            <IconApproximatelyEquals
              position='absolute'
              left='-24px'
              bottom='-42px'
              size={7}
            />

            <RawNumberInput
              onFocus={() => {
                setError('')
                setFiatAmount('')
              }}
              onBlur={async () => {
                clearTimeout(timeout.current)
                const validBalance = checkBalance(filAmount)
                if (validBalance) {
                  const fiatAmnt = await toUSD(filAmount)
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
                setFilAmount('')
              }}
              onBlur={async () => {
                clearTimeout(timeout.current)
                const fil = await fromUSD(fiatAmount)
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
  onAmountChange: func.isRequired,
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
  setError: func.isRequired,
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
