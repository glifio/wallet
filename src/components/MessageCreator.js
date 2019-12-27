import React, { useState } from 'react';
import { Message } from '@openworklabs/filecoin-wallet-provider';
import BigNumber from 'bignumber.js';
import { useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

import { useWallets, useBalance } from '../hooks';
import { confirmMessage, error } from '../store/actions';
import { MessageCreator, SectionHeader, MessageForm, ToInput, InputLabel, AvailableBalance, AvailableBalanceLabel, AmountInput, CancelButton, SendButton } from './StyledComponents'
import filecoin from '../wallet';

// TODO: better validation
const isValidForm = (toAddress, value, balance, errors) => {
  const errorFree = !errors.value && !errors.toAddress;
  const fieldsFilledOut = toAddress && value;
  const enoughInTheBank = balance.isGreaterThan(value);
  return !!(errorFree && fieldsFilledOut && enoughInTheBank);
};

const MsgCreator = () => {
  const { selectedWallet } = useWallets();
  const balance = useBalance();
  const dispatch = useDispatch();
  const [toAddress, setToAddress] = useState('');
  const [value, setValue] = useState('');
  const [errors, setErrors] = useState({ value: false, toAddress: false });

  const handleValueChange = e => {
    // clear errors for better UX
    setErrors({
      ...errors,
      value: false,
    });
    // handle case where user deletes all values from text input
    if (!e.target.value) setValue('');
    // user entered non-numeric characters
    else if (e.target.value && new BigNumber(e.target.value).isNaN()) {
      setErrors({
        ...errors,
        value: 'Must pass numbers only',
      });
    }
    // user enters a value that's greater than their balance
    else if (new BigNumber(e.target.value).isGreaterThan(balance)) {
      setErrors({
        ...errors,
        value: "The amount must be smaller than this account's balance",
      });
      // still set the value for better feedback in the UI, but we don't allow submission of form
      setValue(new BigNumber(e.target.value));
    }
    // handle number change
    else setValue(new BigNumber(e.target.value));
  };

  // TODO: better validation
  const handleSubmit = async e => {
    e.preventDefault();

    const message = new Message({
      to: toAddress,
      from: selectedWallet.address,
      value: value.toString(),
      method: 0,
    });
    const confirmed = window.confirm(
      `Are you sure you want to send ${value} Filecoin to ${toAddress}?`
    );
    if (confirmed) {
      try {
        await message.generateNonce();
        const signedMessage = await filecoin.wallet.sign(message.encode());
        await filecoin.sendMessage(signedMessage);
        dispatch(confirmMessage(message.encode()));
      } catch (err) {
        dispatch(error(err));
      }
    }
  };

  return (
    <React.Fragment>
      <MessageCreator>
        <hr />
        <SectionHeader>Send Filecoin</SectionHeader>
        <Form onSubmit={handleSubmit}>
          <MessageForm>
            <ToInput>
              <Form.Group controlId="toAddress">
                <InputLabel>To</InputLabel>
                <InputGroup>
                  <Form.Control
                    type="text"
                    aria-describedby="toAddressPrepend"
                    name="toAddress"
                    value={toAddress}
                    onChange={e => setToAddress(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
            </ToInput>

            <AvailableBalance>
              <AvailableBalanceLabel>Available</AvailableBalanceLabel>
              {balance.toString()}
            </AvailableBalance>

            <AmountInput>
              <InputLabel>Amount</InputLabel>
              <Form.Group controlId="value">
                <InputGroup>
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
            </AmountInput>

            <CancelButton>
              Cancel
            </CancelButton>

            <SendButton
              disabled={!isValidForm(toAddress, value, balance, errors)}
              type="submit"
            >
              Send
            </SendButton>
          </MessageForm>
        </Form>
      </MessageCreator>
    </React.Fragment>
  );
};

export default MsgCreator;
