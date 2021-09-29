import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { FilecoinNumber } from '@glif/filecoin-number'
import { Message } from '@glif/filecoin-message'

import { Box, Text, Input, Button, StyledATag } from '../../Shared'
import { useWalletProvider } from '../../../WalletProvider'
import useWallet from '../../../WalletProvider/useWallet'
import { FILECOIN_NUMBER_PROP } from '../../../customPropTypes'

const Helper = ({
  error,
  saving,
  dirty,
  setGasInfoWMaxFee,
  reset,
  estimatedTransactionFee
}) => {
  if (error) {
    return (
      <Text color='status.fail.background' width='100%'>
        {error}
      </Text>
    )
  }

  if (saving) {
    return <Text width='100%'>Saving new transaction fee...</Text>
  }

  if (dirty) {
    return (
      <>
        <Button
          variant='secondary'
          title='Save'
          mr={2}
          my={2}
          onClick={setGasInfoWMaxFee}
          disabled={saving}
        />
        <Button
          variant='secondary'
          title='Cancel'
          my={2}
          onClick={reset}
          disabled={saving}
        />
      </>
    )
  }

  return (
    <Text width='100%' color='core.darkgray'>
      You will not pay more than {estimatedTransactionFee.toFil()} FIL for this
      transaction.{' '}
      <StyledATag
        rel='noopener noreferrer'
        target='_blank'
        href='https://filfox.info/en/stats/gas'
      >
        More information on average gas fee statistics.
      </StyledATag>
    </Text>
  )
}

Helper.propTypes = {
  error: PropTypes.string.isRequired,
  saving: PropTypes.bool.isRequired,
  dirty: PropTypes.bool.isRequired,
  setGasInfoWMaxFee: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  estimatedTransactionFee: FILECOIN_NUMBER_PROP
}

const insufficientMsigFundsErr =
  'The Signing account on your Ledger device does not have sufficient funds to pay this transaction fee.'
const insufficientSendFundsErr =
  'This account does not have enough FIL to pay for this transaction + the transaction fee.'

const friendlifyError = (err) => {
  if (!err.message) return err
  if (err.message.toLowerCase().includes('retcode=2'))
    return insufficientMsigFundsErr
  if (err.message.toLowerCase().includes('retcode=6'))
    return insufficientSendFundsErr
  return err.message
}

const CustomizeFee = ({
  message,
  gasInfo,
  setGasInfo,
  setFrozen,
  error,
  setError,
  feeMustBeLessThanThisAmount,
  disabled
}) => {
  const [mounted, setMounted] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [loadingFee, setLoadingFee] = useState(false)
  const [savingNewFee, setSavingNewFee] = useState(false)
  const [localTxFee, setLocalTxFee] = useState(
    new FilecoinNumber('0', 'attofil')
  )
  const { walletProvider } = useWalletProvider()
  const wallet = useWallet()

  useEffect(() => {
    const estimate = async () => {
      try {
        setLoadingFee(true)
        setFrozen(true)
        const res = await walletProvider.gasEstimateMaxFee(message)
        setLocalTxFee(res.maxFee)
        setGasInfo({
          gasPremium: new FilecoinNumber(res.message.GasPremium, 'attofil'),
          gasFeeCap: new FilecoinNumber(res.message.GasFeeCap, 'attofil'),
          gasLimit: new FilecoinNumber(res.message.GasLimit, 'attofil'),
          estimatedTransactionFee: res.maxFee
        })
        if (res.maxFee.isGreaterThanOrEqualTo(feeMustBeLessThanThisAmount)) {
          const err =
            message.Method === 0
              ? insufficientSendFundsErr
              : insufficientMsigFundsErr
          setError(err)
        }
      } catch (err) {
        setError(friendlifyError(err))
      } finally {
        setLoadingFee(false)
        setFrozen(false)
      }
    }

    if (!mounted) {
      setMounted(true)
      estimate()
    }
  }, [
    gasInfo,
    message,
    setGasInfo,
    walletProvider,
    mounted,
    setMounted,
    setError,
    setFrozen,
    feeMustBeLessThanThisAmount
  ])

  const setGasInfoWMaxFee = async () => {
    if (localTxFee.isLessThanOrEqualTo(0) || localTxFee.isNaN()) {
      setError('Invalid number entered. Please try again.')
      return
    }

    if (localTxFee.isGreaterThan(feeMustBeLessThanThisAmount)) {
      setError(insufficientMsigFundsErr)
      return
    }
    try {
      const msgWithoutGas = new Message({
        to: message.To,
        from: message.From,
        value: message.Value,
        method: message.Method,
        nonce: message.Nonce,
        params: message.Params
      })
      setFrozen(true)
      setSavingNewFee(true)
      const msgWithGas = (
        await walletProvider.gasEstimateMessageGas(
          msgWithoutGas.toLotusType(),
          localTxFee.toAttoFil()
        )
      ).toLotusType()
      setGasInfo({
        estimatedTransactionFee: localTxFee,
        gasPremium: new FilecoinNumber(msgWithGas.GasPremium, 'attofil'),
        gasFeeCap: new FilecoinNumber(msgWithGas.GasFeeCap, 'attofil'),
        gasLimit: new FilecoinNumber(msgWithGas.GasLimit, 'attofil')
      })
      setDirty(false)
    } catch (err) {
      setError(friendlifyError(err))
    } finally {
      setFrozen(false)
      setSavingNewFee(false)
    }
  }

  const reset = () => {
    setDirty(false)
    setFrozen(false)
    setLocalTxFee(gasInfo.estimatedTransactionFee)
  }

  return (
    <Box
      display='flex'
      flexDirection='row'
      alignItems='center'
      justifyContent='space-between'
      bg='background.screen'
    >
      {loadingFee ? (
        <Text ml={2} color='core.primary'>
          Calculating an estimated transaction fee...
        </Text>
      ) : (
        <Box
          display='flex'
          flexDirection='column'
          alignItems='flex-end'
          flexGrow={1}
          maxWidth={13}
        >
          <Input.Number
            disabled={disabled}
            name='tx-fee'
            label='Transaction fee'
            value={localTxFee.toAttoFil()}
            denom='aFil'
            onChange={(e) => {
              if (error) setError('')
              if (!dirty) {
                setDirty(true)
                setFrozen(true)
              }
              setLocalTxFee(new FilecoinNumber(e.target.value, 'attofil'))
            }}
            balance={wallet.balance}
          />
          <Box
            display='flex'
            justifyContent='flex-end'
            textAlign='left'
            width='100%'
          >
            <Helper
              error={error}
              dirty={dirty}
              saving={savingNewFee}
              setGasInfoWMaxFee={setGasInfoWMaxFee}
              reset={reset}
              estimatedTransactionFee={gasInfo.estimatedTransactionFee}
              feeMustBeLessThanThisAmount={feeMustBeLessThanThisAmount}
            />
          </Box>
        </Box>
      )}
    </Box>
  )
}

CustomizeFee.propTypes = {
  message: PropTypes.object.isRequired,
  setGasInfo: PropTypes.func.isRequired,
  gasInfo: PropTypes.shape({
    estimatedTransactionFee: FILECOIN_NUMBER_PROP,
    gasPremium: FILECOIN_NUMBER_PROP,
    gasFeeCap: FILECOIN_NUMBER_PROP,
    gasLimit: FILECOIN_NUMBER_PROP
  }),
  setFrozen: PropTypes.func.isRequired,
  feeMustBeLessThanThisAmount: FILECOIN_NUMBER_PROP,
  error: PropTypes.string.isRequired,
  setError: PropTypes.func.isRequired,
  disabled: PropTypes.bool
}

CustomizeFee.defaultProps = {
  disabled: false
}

export default CustomizeFee
