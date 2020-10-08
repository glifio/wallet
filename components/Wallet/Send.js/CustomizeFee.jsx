import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { FilecoinNumber } from '@glif/filecoin-number'

import { Box, Text, Input, FinePrint, Button } from '../../Shared'
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
    return <Text>{error}</Text>
  }

  if (saving) {
    return <Text>Saving new transaction fee.</Text>
  }

  if (dirty) {
    return (
      <>
        <Button
          variant='secondary'
          title='Save'
          mr={2}
          onClick={setGasInfoWMaxFee}
          disabled={saving}
        />
        <Button
          variant='secondary'
          title='Cancel'
          onClick={reset}
          disabled={saving}
        />
      </>
    )
  }

  return (
    <FinePrint width='50%'>
      *You will not pay more than {estimatedTransactionFee.toFil()} FIL for this
      transaction.
    </FinePrint>
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

const CustomizeFee = ({ message, gasInfo, setGasInfo, setFrozen }) => {
  const [mounted, setMounted] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [loadingFee, setLoadingFee] = useState(false)
  const [savingNewFee, setSavingNewFee] = useState(false)
  const [error, setError] = useState('')
  const [localTxFee, setLocalTxFee] = useState(
    new FilecoinNumber('0', 'attofil')
  )
  const { walletProvider } = useWalletProvider()
  const wallet = useWallet()
  useEffect(() => {
    const estimate = async () => {
      try {
        setLoadingFee(true)
        const estimatedTransactionFee = await walletProvider.gasEstimateMaxFee(
          message
        )
        setLocalTxFee(estimatedTransactionFee)
        setGasInfo({ ...gasInfo, estimatedTransactionFee })
      } catch (err) {
        setError(err.message || err)
      } finally {
        setLoadingFee(false)
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
    setError
  ])

  const setGasInfoWMaxFee = async () => {
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
        <Box display='flex' flexDirection='column'>
          <Input.Number
            name='tx-fee'
            label='Transaction fee'
            value={localTxFee.toAttoFil()}
            denom='aFil'
            onChange={e => {
              if (!dirty) {
                setDirty(true)
                setFrozen(true)
              }
              setLocalTxFee(new FilecoinNumber(e.target.value, 'attofil'))
            }}
            balance={wallet.balance}
          />
          <Box display='flex' flexDirection='row' justifyContent='flex-end'>
            <Helper
              error={error}
              dirty={dirty}
              saving={savingNewFee}
              setGasInfoWMaxFee={setGasInfoWMaxFee}
              reset={reset}
              estimatedTransactionFee={gasInfo.estimatedTransactionFee}
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
  setFrozen: PropTypes.func.isRequired
}

export default CustomizeFee
