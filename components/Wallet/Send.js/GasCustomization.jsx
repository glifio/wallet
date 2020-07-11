import React, { useRef } from 'react'
import { FilecoinNumber } from '@openworklabs/filecoin-number'
import { func, bool, string } from 'prop-types'
import { Box, Label, Input, StyledATag } from '../../Shared'
import { FILECOIN_NUMBER_PROP } from '../../../customPropTypes'
import reportError from '../../../utils/reportError'

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
      try {
        const gas = await estimateGas(
          new FilecoinNumber(val || '0', 'attofil'),
          gasLimit,
          value
        )
        setEstimatedGas(gas)
      } catch (err) {
        reportError(11, false, err.message, err.stack)
      }
    }, 500)
  }

  return (
    <>
      {show && (
        <Box mt={2} p={3} borderTop={1} borderBottom={1} borderColor='silver'>
          <Box
            display='flex'
            justifyContent='space-between'
            alignItems='center'
          >
            <Label my={3} pl={2} color='core.darkgray'>
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
          <Box>
            <Box mt={3}>
              <Input.Number
                top
                bottom={false}
                mt={2}
                m='0'
                denom='AttoFil'
                label='Gas Price'
                value={gasPrice.toAttoFil()}
                onChange={onGasPriceInputChange}
              />
              <Box borderColor='background.screen'>
                <NumberedInput
                  bottom
                  top={false}
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
          </Box>
        </Box>
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
