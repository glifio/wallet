import React, { useEffect, useRef, useState } from 'react'
import { func, string } from 'prop-types'
import { FilecoinNumber } from '@openworklabs/filecoin-number'
import {
  Box,
  Button,
  Text,
  IconLedger,
  Input,
  StyledATag,
  Label
} from '../../Shared'
import makeFriendlyBalance from '../../../utils/makeFriendlyBalance'
import useWallet from '../../../WalletProvider/useWallet'
import { FILECOIN_NUMBER_PROP } from '../../../customPropTypes'

// this is a weird hack to get tests to run in jest...
const NumberedInput = Input.Number

const GasCustomization = ({
  close,
  gasPrice,
  gasLimit,
  estimateGas,
  setGasPrice,
  setGasLimit,
  setEstimatedGas,
  value,
  makeFriendlyWalletBalance
}) => {
  const [gasPriceLocal, setGasPriceLocal] = useState(gasPrice)
  const [gasLimitLocal, setGasLimitLocal] = useState(gasLimit)
  const [estimatedGasFeeLocal, setEstimatedGasFeeLocal] = useState(
    new FilecoinNumber('122', 'attofil')
  )
  const [error, setError] = useState('')
  const [fetchedInitialEstimate, setFetchedInitialEstimate] = useState(false)

  useEffect(() => {
    const fetchInitialEstimate = async () => {
      try {
        const gas = await estimateGas(
          new FilecoinNumber('1', 'attofil'),
          gasLimit,
          value
        )
        setEstimatedGasFeeLocal(gas)
      } catch (err) {
        setError(err.message)
      }
    }

    if (!fetchedInitialEstimate) {
      setFetchedInitialEstimate(true)
      fetchInitialEstimate()
    }
  }, [
    fetchedInitialEstimate,
    setFetchedInitialEstimate,
    estimateGas,
    gasLimit,
    value
  ])

  const timeout = useRef(null)

  const onGasPriceInputChange = e => {
    const val = e.target.value
    setGasPriceLocal(new FilecoinNumber(val || '0', 'attofil'))
    clearTimeout(timeout.current)
    timeout.current = setTimeout(async () => {
      try {
        const gas = await estimateGas(
          new FilecoinNumber(val || '0', 'attofil'),
          gasLimit,
          value
        )
        setEstimatedGasFeeLocal(gas)
      } catch (err) {
        setError(err.message)
      }
    }, 500)
  }

  const onSubmit = e => {
    e.preventDefault()
    setGasPrice(gasPriceLocal)
    setGasLimit(gasLimitLocal)
    setEstimatedGas(estimatedGasFeeLocal)
    close()
  }

  const wallet = useWallet()

  return (
    <form onSubmit={onSubmit}>
      <Box p={3} bg='background.screen'>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Text my={3} pl={2} color='core.darkgray'>
            Transfers complete faster with a higher gas price.
          </Text>

          <StyledATag
            rel='noopener noreferrer'
            target='_blank'
            mt={0}
            color='core.primary'
            href='https://kb.myetherwallet.com/en/transactions/what-is-gas/'
          >
            What&rsquo;s this?
          </StyledATag>
        </Box>
        <Box>
          <Box mt={3}>
            <Input.Number
              top
              bottom={false}
              mt={2}
              m='0'
              denom='AttoFil'
              label='Gas Price'
              value={gasPriceLocal.toAttoFil()}
              onChange={onGasPriceInputChange}
            />
            <Box borderColor='background.screen'>
              <NumberedInput
                bottom
                top={false}
                m='0'
                denom='AttoFil'
                label='Gas Limit'
                value={gasLimitLocal.toAttoFil()}
                onChange={e =>
                  setGasLimitLocal(
                    new FilecoinNumber(e.target.value || '0', 'attofil')
                  )
                }
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        display='flex'
        flexDirection='row'
        justifyContent='space-between'
        width='100%'
        p={3}
        border={0}
        bg='background.screen'
      >
        <Box>
          <Text margin={0}>Transaction Fee</Text>
          <Box display='flex' alignItems='center'>
            <Text margin={0} color='core.darkgray'>
              Paid via
            </Text>
            <IconLedger height='32px' />{' '}
            <Text margin={0} color='core.darkgray'>
              {makeFriendlyBalance(wallet.balance, 2, true)} FIL
            </Text>
          </Box>
        </Box>

        {/* <Box>
          <Text margin={0}>Transaction Fee</Text>
          <Text margin={0} color='core.darkgray'>
            Paid via <IconLedger /> {walletBalance} FIL
          </Text>
        </Box> */}
        <Text ml={2} color={error ? 'status.fail.background' : 'core.primary'}>
          {error
            ? 'Error fetching transaction fee'
            : `${estimatedGasFeeLocal.toAttoFil()} AttoFil`}
        </Text>
      </Box>

      <Box
        display='flex'
        flexDirection='row'
        justifyContent='space-between'
        bg='background.screen'
        p={3}
        borderBottomLeftRadius={3}
        borderBottomRightRadius={3}
      >
        <Button
          variant='secondary'
          title='Cancel'
          onClick={close}
          type='button'
        />
        <Button variant='primary' title='Save' disabled={error} type='submit' />
      </Box>
    </form>
  )
}

GasCustomization.propTypes = {
  close: func.isRequired,
  gasPrice: FILECOIN_NUMBER_PROP,
  gasLimit: FILECOIN_NUMBER_PROP,
  setGasPrice: func.isRequired,
  setGasLimit: func.isRequired,
  estimateGas: func.isRequired,
  setEstimatedGas: func.isRequired,
  value: string.isRequired,
  makeFriendlyBalance: string.isRequired
}

export default GasCustomization
