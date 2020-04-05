import React, { useRef, useState, useEffect } from 'react'
import { FilecoinNumber } from '@openworklabs/filecoin-number'
import { func } from 'prop-types'
import {
  Box,
  Button,
  Input,
  Label,
  Title,
  FloatingContainer,
  ContentContainer
} from '../../Shared'
import { FILECOIN_NUMBER_PROP } from '../../../customPropTypes'

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
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Label mt={3} mb={3}>
          Submit a custom fee
        </Label>
        <Label
          mt={0}
          color='core.primary'
          css={`
            text-decoration: underline;
            cursor: pointer;
          `}
        >
          What&rsquo;s this?
        </Label>
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
