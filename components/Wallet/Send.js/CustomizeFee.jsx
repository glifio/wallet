import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { Box, Text, Input } from '../../Shared'
import { useWalletProvider } from '../../../WalletProvider'
import useWallet from '../../../WalletProvider/useWallet'
import { FILECOIN_NUMBER_PROP } from '../../../customPropTypes'

const CustomizeFee = ({
  message,
  estimatedTransactionFee,
  setEstimatedTransactionFee
}) => {
  const [mounted, setMounted] = useState(false)
  const [loadingFee, setLoadingFee] = useState(false)
  const [error, setError] = useState('')
  const { walletProvider } = useWalletProvider()
  const wallet = useWallet()
  useEffect(() => {
    const estimate = async () => {
      try {
        const estimatedFee = await walletProvider.gasEstimateMaxFee(message)
        setEstimatedTransactionFee(estimatedFee)
      } catch (err) {
        setError(err.message || err)
      } finally {
        setLoadingFee(false)
      }
    }

    if (!mounted) {
      setMounted(true)
      setLoadingFee(true)
      estimate()
    }
  }, [
    estimatedTransactionFee,
    message,
    setEstimatedTransactionFee,
    walletProvider,
    mounted,
    setMounted,
    setLoadingFee,
    setError
  ])

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
        <Input.Funds
          name='tx-fee'
          label='Transaction fee'
          amount={estimatedTransactionFee.toFil()}
          onAmountChange={setEstimatedTransactionFee}
          balance={wallet.balance}
          error={error}
          setError={setError}
        />
      )}
    </Box>
  )
}

CustomizeFee.propTypes = {
  message: PropTypes.object.isRequired,
  setEstimatedTransactionFee: PropTypes.func.isRequired,
  estimatedTransactionFee: FILECOIN_NUMBER_PROP
}

export default CustomizeFee
