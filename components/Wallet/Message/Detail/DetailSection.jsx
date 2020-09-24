import React from 'react'
import { FilecoinNumber } from '@openworklabs/filecoin-number'

import { Box, Input } from '../../../Shared'
import { MESSAGE_PROPS } from '../../../../customPropTypes'

const ProposeDetails = ({ params }) => {
  if (params.method === 0) {
  }
  if (params.method === 7) {
  }
}

const DetailSection = ({ message }) => {
  return (
    <>
      <Box mt={3}>
        <Input.Address value={message.from} label='From' disabled />
        <Box height={3} />
        <Input.Address value={message.to} label='To' disabled />
      </Box>
      <Input.Funds
        my={3}
        balance={new FilecoinNumber('0.1', 'fil')}
        label='Amount'
        disabled
        amount={new FilecoinNumber(message.value, 'attofil').toAttoFil()}
      />
    </>
  )
}

DetailSection.propTypes = {
  message: MESSAGE_PROPS.isRequired
}

export default DetailSection
