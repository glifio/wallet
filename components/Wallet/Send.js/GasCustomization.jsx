import React, { useRef, useState, useEffect } from 'react'
import { FilecoinNumber } from '@openworklabs/filecoin-number'
import { func } from 'prop-types'
import {
  Box,
  Button,
  Input,
  Label,
  Text,
  Title,
  FloatingContainer
} from '../../Shared'
import { FILECOIN_NUMBER_PROP } from '../../../customPropTypes'

const gasToButtonMap = (gasLimit, gasPrice) => {
  const options = {
    '1000': {
      '1': 'slow',
      '2': 'medium',
      '3': 'fast'
    }
  }
  if (options[gasLimit.toAttoFil()]) {
    return options[gasLimit.toAttoFil()][gasPrice.toAttoFil()] || 'custom'
  }
}

const GasCustomization = ({
  gasPrice,
  gasLimit,
  estimateGas,
  exit,
  setGasPrice,
  setGasLimit
}) => {
  const [gasPriceLocal, setGasPriceLocal] = useState(gasPrice)
  const [gasLimitLocal, setGasLimitLocal] = useState(gasLimit)
  const [estimatedGas, setEstimatedGas] = useState(null)

  useEffect(() => {
    const fetchInitialGas = async () => {
      const gas = await estimateGas(gasPrice)
      setEstimatedGas(gas)
    }

    fetchInitialGas()
  }, [estimateGas, setEstimatedGas, gasPrice])

  const timeout = useRef(null)

  const onGasPriceInputChange = e => {
    const val = e.target.value
    setGasPriceLocal(new FilecoinNumber(val || '0', 'attofil'))
    clearTimeout(timeout.current)
    timeout.current = setTimeout(async () => {
      const gas = await estimateGas(new FilecoinNumber(val || '0', 'attofil'))
      setEstimatedGas(gas)
    }, 500)
  }

  return (
    <>
      <Label my={3} color='core.primary'>
        Custom Transaction Fee
      </Label>
      <Text mt={5} mb={3}>
        Select a predefined speed
      </Text>
      <Box mb={4} display='flex' flexDirection='row'>
        <Button
          onClick={async () => {
            setGasPriceLocal(new FilecoinNumber('1', 'attofil'))
            setGasLimitLocal(new FilecoinNumber('1000', 'attofil'))
            const gas = await estimateGas(new FilecoinNumber('1', 'attofil'))
            setEstimatedGas(gas)
          }}
          variant={
            gasToButtonMap(gasLimitLocal, gasPriceLocal) === 'slow'
              ? 'tertiary-selected'
              : 'tertiary'
          }
          title='Slow'
          mr={3}
          type='button'
        />
        <Button
          onClick={async () => {
            const newGasPrice = new FilecoinNumber('2', 'attofil')
            setGasPriceLocal(newGasPrice)
            setGasLimitLocal(new FilecoinNumber('1000', 'attofil'))
            const gas = await estimateGas(newGasPrice)
            setEstimatedGas(gas)
          }}
          variant={
            gasToButtonMap(gasLimitLocal, gasPriceLocal) === 'medium'
              ? 'tertiary-selected'
              : 'tertiary'
          }
          title='Medium'
          mr={3}
          type='button'
        />
        <Button
          onClick={async () => {
            const newGasPrice = new FilecoinNumber('3', 'attofil')
            setGasPriceLocal(newGasPrice)
            setGasLimitLocal(new FilecoinNumber('1000', 'attofil'))
            const gas = await estimateGas(newGasPrice)
            setEstimatedGas(gas)
          }}
          variant={
            gasToButtonMap(gasLimitLocal, gasPriceLocal) === 'fast'
              ? 'tertiary-selected'
              : 'tertiary'
          }
          title='Fast'
          mr={3}
          type='button'
        />
      </Box>
      <Input.Number
        mt={2}
        m='0'
        label='Gas Price'
        value={gasPriceLocal.toAttoFil()}
        onChange={onGasPriceInputChange}
      />
      <Input.Number
        css={`
          transform: translateY(-1px);
        `}
        m='0'
        label='Gas Limit'
        value={gasLimitLocal.toAttoFil()}
        onChange={e =>
          setGasLimitLocal(new FilecoinNumber(e.target.value || '0', 'attofil'))
        }
      />
      <Text color='core.darkgray'>
        Transfers complete faster with a higher gas price.
      </Text>
      <Box
        display='flex'
        flexDirection='row'
        alignItems='center'
        justifyContent='space-between'
        mt={3}
        mx={1}
      >
        <Label>New Transaction Fee</Label>
        <Box display='flex' flexDirection='column' textAlign='right' mt={5}>
          <Title fontSize={4} color='core.primary'>
            {estimatedGas
              ? `${estimatedGas.toAttoFil()} AttoFil`
              : 'Loading transaction fee'}
          </Title>
        </Box>
      </Box>
      <FloatingContainer>
        <>
          <Button
            type='button'
            title='Cancel'
            variant='secondary'
            onClick={() => {
              exit()
            }}
          />
          <Button
            type='button'
            title='Save Custom Fee'
            variant='primary'
            disabled={!gasPriceLocal.isGreaterThan(0)}
            onClick={async () => {
              setGasPrice(gasPriceLocal)
              setGasLimit(gasLimitLocal)
              const gas = await estimateGas(gasPriceLocal)
              setEstimatedGas(gas)
              exit()
            }}
          />
        </>
      </FloatingContainer>
    </>
  )
}

GasCustomization.propTypes = {
  gasPrice: FILECOIN_NUMBER_PROP,
  gasLimit: FILECOIN_NUMBER_PROP,
  setGasPrice: func.isRequired,
  setGasLimit: func.isRequired,
  exit: func.isRequired,
  estimateGas: func.isRequired
}

export default GasCustomization
