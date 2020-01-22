import React from 'react'
import PropTypes from 'prop-types'
import 'styled-components/macro'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import FilecoinNumber from '@openworklabs/filecoin-number'

import {
  MessageForm,
  InputLabel,
  AvailableBalanceLabel,
  SendButton
} from '../../StyledComponents'

const formatValue = number => {
  if (FilecoinNumber.isBigNumber(number)) return number.toFil()
  return number
}

const CreateMessage = ({
  toAddress,
  setToAddress,
  balance,
  value,
  handleValueChange,
  errors,
  isValidForm,
  setConfirmStage
}) => {
  return (
    <MessageForm>
      <div>
        <Form.Group controlId='toAddress'>
          <InputLabel>To</InputLabel>
          <InputGroup>
            <Form.Control
              type='text'
              aria-describedby='toAddressPrepend'
              name='toAddress'
              value={toAddress}
              onChange={e => setToAddress(e.target.value)}
            />
          </InputGroup>
        </Form.Group>

        <div
          css={{
            display: 'flex',
            'flex-direction': 'row',
            'justify-content': 'space-between'
          }}
        >
          <div css={{ 'flex-grow': '1', 'max-width': '50%' }}>
            <AvailableBalanceLabel>Available</AvailableBalanceLabel>
            {formatValue(balance)}
          </div>

          <div css={{ 'flex-grow': '1', 'max-width': '50%' }}>
            <InputLabel>Amount</InputLabel>
            <Form.Group controlId='value'>
              <InputGroup>
                <Form.Control
                  placeholder='0'
                  type='number'
                  step='.001'
                  min='0'
                  aria-describedby='valuePrepend'
                  name='value'
                  value={formatValue(value)}
                  onChange={handleValueChange}
                  isInvalid={errors.value}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.value}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </div>
        </div>
      </div>
      <SendButton
        disabled={!isValidForm(toAddress, value, balance, errors)}
        onClick={() => setConfirmStage('reviewMessage')}
      >
        Send
      </SendButton>
    </MessageForm>
  )
}

CreateMessage.propTypes = {
  toAddress: PropTypes.string.isRequired,
  setToAddress: PropTypes.func.isRequired,
  balance: PropTypes.object.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.instanceOf(FilecoinNumber)
  ]),
  handleValueChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  isValidForm: PropTypes.func.isRequired,
  setConfirmStage: PropTypes.func.isRequired
}

export default CreateMessage
