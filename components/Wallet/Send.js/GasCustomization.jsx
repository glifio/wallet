import React, { useState } from 'react'
import { FilecoinNumber } from '@openworklabs/filecoin-number'
import { func } from 'prop-types'
import {
  Box,
  Button,
  Input,
  Label,
  Text,
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
  exit,
  setGasPrice,
  setGasLimit
}) => {
  const [gasPriceLocal, setGasPriceLocal] = useState(gasPrice)
  const [gasLimitLocal, setGasLimitLocal] = useState(gasLimit)

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
          onClick={() => {
            setGasPriceLocal(new FilecoinNumber('1', 'attofil'))
            setGasLimitLocal(new FilecoinNumber('1000', 'attofil'))
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
          onClick={() => {
            setGasPriceLocal(new FilecoinNumber('2', 'attofil'))
            setGasLimitLocal(new FilecoinNumber('1000', 'attofil'))
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
          onClick={() => {
            setGasPriceLocal(new FilecoinNumber('3', 'attofil'))
            setGasLimitLocal(new FilecoinNumber('1000', 'attofil'))
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
        onChange={e =>
          setGasPriceLocal(new FilecoinNumber(e.target.value || '0', 'attofil'))
        }
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
            onClick={() => {
              setGasPrice(gasPriceLocal)
              setGasLimit(gasLimitLocal)
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
  exit: func.isRequired
}

export default GasCustomization
