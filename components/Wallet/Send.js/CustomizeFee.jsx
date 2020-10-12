import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { FilecoinNumber } from '@glif/filecoin-number'

import { Box, Text, Input, Button } from '../../Shared'
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
      <Box display='flex' justifyContent='flex-end' width='100%'>
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
      </Box>
    )
  }

  return (
    <Text width='100%' color='core.darkgray'>
      You will not pay more than {estimatedTransactionFee.toFil()} FIL for this
      transaction.
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

const CustomizeFee = ({
  message,
  gasInfo,
  setGasInfo,
  setFrozen,
  error,
  setError,
  feeMustBeLessThanThisAmount
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
          setError(
            "You don't have enough FIL to pay this transaction fee amount."
          )
        }
      } catch (err) {
        setError(err.message || err)
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
    try {
      setFrozen(true)
      setSavingNewFee(true)
      const msgWithGas = (
        await walletProvider.gasEstimateMessageGas(
          message,
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
      setError(err.message || err)
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
            name='tx-fee'
            label='Transaction fee'
            value={localTxFee.toAttoFil()}
            denom='aFil'
            onChange={e => {
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
            justifyContent='flex-start'
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
  setError: PropTypes.func.isRequired
}

export default CustomizeFee
