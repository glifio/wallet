import React, { forwardRef, useRef, useState } from 'react'
import { func, string, bool, oneOfType } from 'prop-types'
import { FilecoinNumber, BigNumber } from '@glif/filecoin-number'

import Box from '../Box'
import { RawNumberInput, DenomTag } from './Number'
import { Text, Label } from '../Typography'
import { FILECOIN_NUMBER_PROP } from '../../../customPropTypes'
import noop from '../../../utils/noop'

const formatFilValue = number => {
  if (!number) return ''
  if (FilecoinNumber.isBigNumber(number)) return number.toFil()
  return number
}

const Funds = forwardRef(
  (
    {
      onAmountChange,
      balance,
      error,
      setError,
      disabled,
      valid,
      amount,
      label,
      ...props
    },
    ref
  ) => {
    const initialFilAmount =
      amount && amount > 0 ? new FilecoinNumber(amount, 'attofil') : ''

    const [filAmount, setFilAmount] = useState(initialFilAmount)
    const timeout = useRef()

    const checkBalance = val => {
      if (!val || new BigNumber(val).isEqualTo(0)) {
        setError('Please enter a valid amount.')
        return false
      }

      if (new BigNumber(val).toString() === 'NaN') return false
      if (val.isGreaterThan(balance)) {
        setError("The amount must be smaller than this account's balance")
        return false
      }

      return true
    }

    const onTimerFil = async val => {
      const fil = new FilecoinNumber(val, 'fil')
      const validBalance = checkBalance(fil)
      if (validBalance) {
        onAmountChange(fil)
      } else {
        onAmountChange(new FilecoinNumber('0', 'fil'))
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
        minHeight='120px'
        alignItems='center'
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
            <Label color='core.nearblack'>{label}</Label>
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
              borderBottomLeftRadius={2}
              onChange={onFilChange}
              value={formatFilValue(filAmount)}
              placeholder='0'
              type='number'
              step={new FilecoinNumber('1', 'attofil').toFil()}
              disabled={disabled}
              valid={valid && !!formatFilValue(filAmount)}
              {...props}
              my={0}
              px={3}
            />
            <DenomTag
              top='0px'
              left='0px'
              borderTopRightRadius={2}
              borderBottomRightRadius={2}
              valid={valid && !!formatFilValue(filAmount)}
              disabled={disabled}
            >
              FIL
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
  disabled: bool,
  valid: bool,
  amount: oneOfType([string, FILECOIN_NUMBER_PROP]),
  label: string
}

Funds.defaultProps = {
  error: '',
  disabled: false,
  setError: noop,
  onAmountChange: noop,
  amount: '',
  label: 'Amount'
}

export default Funds
