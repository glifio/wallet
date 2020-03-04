import React, { useState } from 'react'
import { FilecoinNumber } from '@openworklabs/filecoin-number'
import { func } from 'prop-types'
import { Box, Button, Input, Label, Text } from '../components/Shared'
import { FILECOIN_NUMBER_PROP } from '../customPropTypes'

const State = () => {
  const [gasPrice, setGasPrice] = useState(new FilecoinNumber('1', 'attofil'))
  const [gasLimit, setGasLimit] = useState(
    new FilecoinNumber('1000', 'attofil')
  )
  return (
    <GasCustomization
      gasPrice={gasPrice}
      gasLimit={gasLimit}
      setGasPrice={setGasPrice}
      setGasLimit={setGasLimit}
    />
  )
}

const GasCustomization = ({ gasPrice, gasLimit, setGasPrice, setGasLimit }) => {
  return (
    <>
      <Label color='core.primary'>Custom transaction Fee</Label>
      <Text>Select a predifined speed</Text>
      <Box display='flex' flexDirection='row'>
        <Button variant='tertiary' title='Slow' mx={2} />
        <Button variant='tertiary' title='Medium' mx={2} />
        <Button variant='tertiary' title='Fast' mx={2} />
        <Button variant='tertiary' title='Custom' />
      </Box>
      <Input.Number
        label='Gas Price'
        value={gasPrice.toAttoFil()}
        onChange={setGasPrice}
      />
    </>
  )
}

GasCustomization.propTypes = {
  gasPrice: FILECOIN_NUMBER_PROP,
  gasLimit: FILECOIN_NUMBER_PROP,
  setGasPrice: func.isRequired,
  setGasLimit: func.isRequired
}

export default State
