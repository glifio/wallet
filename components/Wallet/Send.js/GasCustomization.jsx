import React, { useRef } from 'react'
import { FilecoinNumber } from '@openworklabs/filecoin-number'
import { func, bool, string } from 'prop-types'
import { Box, Input, Label, ContentContainer } from '../../Shared'
import { FILECOIN_NUMBER_PROP } from '../../../customPropTypes'

const GasCustomization = ({
  gasPrice,
  gasLimit,
  estimateGas,
  setGasPrice,
  setGasLimit,
  setEstimatedGas,
  show,
  value
}) => {
  const timeout = useRef(null)

  const onGasPriceInputChange = e => {
    setEstimatedGas(new FilecoinNumber('0', 'attofil'))
    const val = e.target.value
    setGasPrice(new FilecoinNumber(val || '0', 'attofil'))
    clearTimeout(timeout.current)
    timeout.current = setTimeout(async () => {
      const gas = await estimateGas(
        new FilecoinNumber(val || '0', 'attofil'),
        gasLimit,
        value
      )
      setEstimatedGas(gas)
    }, 500)
  }

  return (
    <>
      {show && (
        <ContentContainer mt={2}>
          <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
          >
            <Label my={3} color='core.darkgray'>
              Transfers complete faster with a higher gas price.
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
        </ContentContainer>
      )}
    </>
  )
}

GasCustomization.propTypes = {
  gasPrice: FILECOIN_NUMBER_PROP,
  gasLimit: FILECOIN_NUMBER_PROP,
  setGasPrice: func.isRequired,
  setGasLimit: func.isRequired,
  estimateGas: func.isRequired,
  setEstimatedGas: func.isRequired,
  show: bool.isRequired,
  value: string.isRequired
}

export default GasCustomization
