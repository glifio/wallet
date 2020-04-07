import React, { useRef, useEffect } from 'react'
import { FilecoinNumber } from '@openworklabs/filecoin-number'
import { func } from 'prop-types'
import { Box, Input, Label, Title, ContentContainer } from '../../Shared'
import { FILECOIN_NUMBER_PROP } from '../../../customPropTypes'

const GasCustomization = ({
  gasPrice,
  gasLimit,
  estimateGas,
  setGasPrice,
  setGasLimit,
  estimatedGas,
  setEstimatedGas
}) => {
  useEffect(() => {
    const fetchInitialGas = async () => {
      const gas = await estimateGas(gasPrice)
      setEstimatedGas(gas)
    }

    fetchInitialGas()
  }, [estimateGas, setEstimatedGas, gasPrice])

  const timeout = useRef(null)

  const onGasPriceInputChange = e => {
    setEstimatedGas(new FilecoinNumber('0', 'attofil'))
    const val = e.target.value
    setGasPrice(new FilecoinNumber(val || '0', 'attofil'))
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
        value={gasPrice.toAttoFil()}
        onChange={onGasPriceInputChange}
      />
      <Input.Number
        css={`
          transform: translateY(-1px);
        `}
        m='0'
        label='Gas Limit'
        value={gasLimit.toAttoFil()}
        onChange={e =>
          setGasLimit(new FilecoinNumber(e.target.value || '0', 'attofil'))
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
        <Title>New Estimated Transaction Fee</Title>
        <Box display='flex' flexDirection='column' LabelAlign='right'>
          <Title fontSize={4} color='core.primary'>
            {!estimatedGas.isEqualTo(0)
              ? `${estimatedGas.toAttoFil()} AttoFil`
              : 'Loading fee'}
          </Title>
        </Box>
      </Box>
    </ContentContainer>
  )
}

GasCustomization.propTypes = {
  gasPrice: FILECOIN_NUMBER_PROP,
  gasLimit: FILECOIN_NUMBER_PROP,
  setGasPrice: func.isRequired,
  setGasLimit: func.isRequired,
  estimateGas: func.isRequired,
  estimatedGas: FILECOIN_NUMBER_PROP,
  setEstimatedGas: func.isRequired
}

export default GasCustomization
