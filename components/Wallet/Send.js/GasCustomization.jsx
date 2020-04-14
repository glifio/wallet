import React, { useRef } from 'react'
import { FilecoinNumber } from '@openworklabs/filecoin-number'
import { func, bool, string } from 'prop-types'
import { Box, Label, ContentContainer, Input, StyledATag } from '../../Shared'
import { FILECOIN_NUMBER_PROP } from '../../../customPropTypes'

// this is a weird hack to get tests to run in jest...
const NumberedInput = Input.Number

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
          <Box border={1} borderColor='input.border'>
            <Input.Number
              border={0}
              mt={2}
              m='0'
              denom='AttoFil'
              label='Gas Price'
              value={gasPrice.toAttoFil()}
              onChange={onGasPriceInputChange}
            />
            <Box borderTop={1} borderColor='input.border'>
              <NumberedInput
                border={0}
                m='0'
                denom='AttoFil'
                label='Gas Limit'
                value={gasLimit.toAttoFil()}
                onChange={e =>
                  setGasLimit(
                    new FilecoinNumber(e.target.value || '0', 'attofil')
                  )
                }
              />
            </Box>
          </Box>
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
