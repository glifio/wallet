import React, { useRef, useState, useEffect } from 'react'
import { FilecoinNumber } from '@openworklabs/filecoin-number'
import { func } from 'prop-types'
import {
  Box,
  Button,
  Input,
  Label,
  Title,
  Text,
  FloatingContainer,
  ContentContainer
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
    <ContentContainer>
      <Text>Would you like to manually set your transaction speed?</Text>
      <Text
        mt={0}
        color='core.primary'
        css={`
          text-decoration: underline;
          cursor: pointer;
        `}
      >
        What's this?
      </Text>
      {/* <Label mt={3} mb={3}>
        Select a preset transfer speed
      </Label>
      <Box mb={4} display='flex' flexDirection='row'>
        <Button
          onClick={async () => {
            setGasPriceLocal(new FilecoinNumber('1', 'attofil'))
            setGasLimitLocal(new FilecoinNumber('1000', 'attofil'))
            const gas = await estimateGas(new FilecoinNumber('1', 'attofil'))
            setEstimatedGas(gas)
          }}
          color='core.primary'
          backgroundColor='core.transparent'
          borderColor='core.primary'
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
          color='core.primary'
          backgroundColor='core.transparent'
          borderColor='core.primary'
          title='Medium'
          mr={3}
          py={1}
          px={3}
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
          color='core.primary'
          backgroundColor='core.transparent'
          borderColor='core.primary'
          title='Fast'
          mr={3}
          py={1}
          type='button'
        />
      </Box> */}
      <Label mt={3} mb={3}>
        Submit a custom fee
      </Label>
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
      <Label my={3} color='core.darkgray'>
        Transfers complete faster with a higher gas price.
      </Label>
      <Box
        display='flex'
        flexDirection='row'
        alignItems='center'
        justifyContent='space-between'
        mt={7}
        mx={1}
      >
        <Title>New Transaction Fee</Title>
        <Box display='flex' flexDirection='column' LabelAlign='right'>
          <Title fontSize={4} color='core.primary'>
            {estimatedGas
              ? `${estimatedGas.toAttoFil()} AttoFil`
              : 'Loading transaction fee'}
          </Title>
        </Box>
      </Box>
      <FloatingContainer>
        <Button
          border={0}
          borderRight={1}
          borderRadius={0}
          borderColor='core.lightgray'
          type='button'
          title='Back'
          variant='secondary'
          onClick={() => {
            exit()
          }}
        />
        <Button
          border={0}
          borderRadius={0}
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
      </FloatingContainer>
    </ContentContainer>
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
