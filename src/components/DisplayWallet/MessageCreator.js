import React, { useState, useReducer } from 'react'
import 'styled-components/macro'
import { Message } from '@openworklabs/filecoin-wallet-provider'
import BigNumber from 'bignumber.js'
import { useDispatch, useSelector } from 'react-redux'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import 'styled-components/macro'

import { useWallets, useBalance } from '../../hooks'
import { confirmMessage, error, clearError } from '../../store/actions'
import {
  MessageCreator,
  SectionHeader,
  MessageForm,
  InputLabel,
  AvailableBalanceLabel,
  SendButton,
  MessageReview,
  UnderlineOnHover
} from '../StyledComponents'
import { toLowerCaseMsgFields } from '../../utils'
import { LEDGER } from '../../constants'
import connectLedger, {
  reducer,
  initialLedgerState,
  RESET_STATE
} from '../../utils/ledger'
import computeSig from './computeSig'

// TODO: better validation
const isValidForm = (toAddress, value, balance, errors) => {
  const errorFree = !errors.value && !errors.toAddress
  const fieldsFilledOut = toAddress && value
  const enoughInTheBank = balance.isGreaterThan(value)
  return !!(errorFree && fieldsFilledOut && enoughInTheBank)
}

const MsgCreator = () => {
  const { selectedWallet } = useWallets()
  const balance = useBalance()
  const dispatch = useDispatch()
  const [toAddress, setToAddress] = useState('')
  const [value, setValue] = useState('')
  const [confirmStage, setConfirmStage] = useState('')
  const [errors, setErrors] = useState({ value: false, toAddress: false })
  const { errorFromRdx, walletProvider, walletType } = useSelector(state => ({
    errorFromRdx: state.error,
    walletProvider: state.walletProvider,
    walletType: state.walletType
  }))
  const [ledgerState, dispatchLocal] = useReducer(reducer, initialLedgerState)

  const handleValueChange = e => {
    // clear errors for better UX
    setErrors({
      ...errors,
      value: false
    })
    // handle case where user deletes all values from text input
    if (!e.target.value) setValue('')
    // user entered non-numeric characters
    else if (e.target.value && new BigNumber(e.target.value).isNaN()) {
      setErrors({
        ...errors,
        value: 'Must pass numbers only'
      })
    }
    // user enters a value that's greater than their balance
    else if (new BigNumber(e.target.value).isGreaterThanOrEqualTo(balance)) {
      setErrors({
        ...errors,
        value: "The amount must be smaller than this account's balance"
      })
      // still set the value for better feedback in the UI, but we don't allow submission of form
      setValue(new BigNumber(e.target.value))
    }
    // handle number change
    else setValue(new BigNumber(e.target.value))
  }

  // TODO: better validation
  const handleSubmit = async e => {
    e.preventDefault()

    if (confirmStage === 'reviewMessage' && walletType === LEDGER) {
      setConfirmStage('reviewOnDevice')
    }

    const message = new Message({
      to: toAddress,
      from: selectedWallet.address,
      value: value.toString(),
      method: 0
    })

    try {
      await message.generateNonce()
      let provider = walletProvider
      if (walletType === LEDGER) {
        provider = await connectLedger(dispatchLocal, dispatch)
      }
      if (provider) {
        dispatch(clearError())
        const signature = await computeSig(
          provider,
          selectedWallet,
          message,
          walletType
        )
        const messageObj = message.toObj()
        const msgCid = await provider.sendMessage(messageObj, signature)
        messageObj.cid = msgCid['/']
        dispatch(confirmMessage(toLowerCaseMsgFields(messageObj)))
        setToAddress('')
        setValue('')
        setConfirmStage('')
      }
    } catch (err) {
      if (
        err.message &&
        err.message.toLowerCase().includes('transaction rejected')
      ) {
        setToAddress('')
        setValue('')
        setConfirmStage('')
      }
      dispatch(error(err))
    }
  }
  return (
    <React.Fragment>
      <MessageCreator>
        <hr />
        <SectionHeader>Send Filecoin</SectionHeader>
        <Form onSubmit={handleSubmit}>
          {!confirmStage && (
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
                    {balance.toString()}
                  </div>

                  <div css={{ 'flex-grow': '1', 'max-width': '50%' }}>
                    <InputLabel>Amount</InputLabel>
                    <Form.Group controlId='value'>
                      <InputGroup>
                        <Form.Control
                          placeholder='0'
                          type='number'
                          aria-describedby='valuePrepend'
                          name='value'
                          value={value.toString()}
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
          )}
          {confirmStage === 'reviewMessage' && (
            <MessageForm>
              {ledgerState.userInitiatedImport &&
              ledgerState.userImportFailure ? (
                <MessageReview>
                  Is your Ledger plugged in, unlocked, and Filecoin app open?
                </MessageReview>
              ) : (
                <>
                  <MessageReview>
                    You're sending <strong>{value.toString()} FIL</strong> to{' '}
                    <strong>{toAddress}</strong>
                    {walletType === LEDGER && (
                      <UnderlineOnHover
                        css={{ 'font-size': '13px', 'margin-top': '10px' }}
                        role='button'
                        rel='noopener noreferrer'
                        onClick={async () => {
                          try {
                            const provider = await connectLedger(
                              dispatchLocal,
                              dispatch
                            )
                            if (provider) {
                              dispatch(clearError())
                              await provider.wallet.showAddressAndPubKey(
                                selectedWallet.path
                              )
                            } else {
                              throw new Error('Error connecting with Ledger')
                            }
                          } catch (err) {
                            dispatch(error(err))
                          }
                        }}
                      >
                        Display my address and path on my Ledger.
                      </UnderlineOnHover>
                    )}
                  </MessageReview>
                  <SendButton type='submit'>Send</SendButton>
                </>
              )}
            </MessageForm>
          )}

          {confirmStage === 'reviewOnDevice' && (
            <MessageForm>
              <MessageReview>
                {ledgerState.userInitiatedImport &&
                ledgerState.userImportFailure
                  ? `Is your Ledger plugged in, unlocked, and Filecoin app open?`
                  : `Sign the message on your Ledger.`}
              </MessageReview>

              {ledgerState.userInitiatedImport &&
                (ledgerState.userImportFailure || errorFromRdx) && (
                  <SendButton
                    onClick={() => {
                      setConfirmStage('')
                      dispatchLocal({ type: RESET_STATE })
                    }}
                  >
                    Try again
                  </SendButton>
                )}
            </MessageForm>
          )}
        </Form>
      </MessageCreator>
    </React.Fragment>
  )
}

export default MsgCreator
