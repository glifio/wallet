import React, { useState } from 'react'
import { Message } from '@openworklabs/filecoin-wallet-provider';
import BigNumber from 'bignumber.js'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button'

import { useAccounts, useBalance } from '../hooks';
import filecoin from '../wallet'

// TODO: better validation
const isValidForm = (toAddress, value, balance, errors) => {
  const errorFree = !errors.value && !errors.toAddress;
  const fieldsFilledOut = toAddress && value
  const enoughInTheBank = balance.isGreaterThan(value)
  return !!(errorFree && fieldsFilledOut && enoughInTheBank);
}

const MsgCreator = () => {
  const { selectedAccount } = useAccounts()
  const balance = useBalance()
  const [toAddress, setToAddress] = useState('')
  const [value, setValue] = useState('')
  const [errors, setErrors] = useState({ value: false, toAddress: false })

  const handleValueChange = e => {
    // clear errors for better UX
    setErrors({
      ...errors,
      value: false
    })
    // handle case where user deletes all values from text input
    if (!e.target.value) setValue('');
    // user entered non-numeric characters
    else if (
      e.target.value &&
      new BigNumber(e.target.value).isNaN()
    ) {
      setErrors({
        ...errors,
        value: 'Must pass numbers only',
      });
    }
    // user enters a value that's greater than their balance
    else if (new BigNumber(e.target.value).isGreaterThan(balance)) {
      setErrors({
        ...errors,
        value: "The amount must be smaller than this account's balance"
      })
      // still set the value for better feedback in the UI, but we don't allow submission of form
      setValue(new BigNumber(e.target.value));
    }
    // handle number change
    else setValue(new BigNumber(e.target.value))
  };

  // TODO: better validation
  const handleSubmit = async (e) => {
    e.preventDefault()

    const message = new Message({ to: toAddress, from: selectedAccount, value: value.toString(), method: 0 })
    const confirmed = window.confirm(`Are you sure you want to send ${value} Filecoin to ${toAddress}?`)
    if (confirmed) {
      await message.generateNonce()
      const signedMessage = await filecoin.wallet.sign(message.encode())
      const tx = await filecoin.sendMessage(signedMessage)
      console.log(signedMessage, tx);
    }
  }

  return (
    <React.Fragment>
      <h5>Send some filecoin</h5>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="fromAddress">
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id="fromAddressPrepend">From</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              type="text"
              placeholder="Select an account from above"
              aria-describedby="fromAddressPrepend"
              name="fromAddress"
              value={selectedAccount}
              disabled
            />
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="toAddress">
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id="toAddressPrepend">To</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              type="text"
              placeholder="An account to send Filecoin to"
              aria-describedby="toAddressPrepend"
              name="toAddress"
              value={toAddress}
              onChange={e => setToAddress(e.target.value)}
            />
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="value">
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id="valuePrepend">Amount</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              placeholder="0"
              type="text"
              aria-describedby="valuePrepend"
              name="value"
              value={value.toString()}
              onChange={handleValueChange}
              isInvalid={errors.value}
            />
            <Form.Control.Feedback type="invalid">
              {errors.value}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

        <Button disabled={!isValidForm(toAddress, value, balance, errors)} variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </React.Fragment>
  );
}

export default MsgCreator
