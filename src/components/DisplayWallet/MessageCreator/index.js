import React, { useState, useReducer } from 'react'
import 'styled-components/macro'
import Message from '@openworklabs/filecoin-message'
import { validateAddressString } from '@openworklabs/filecoin-address'
import FilecoinNumber from '@openworklabs/filecoin-number'
import { useDispatch, useSelector } from 'react-redux'
import Form from 'react-bootstrap/Form'

import { useWallets, useBalance } from '../../../hooks'
import { confirmMessage, error, clearError } from '../../../store/actions'
import { MessageCreator, SectionHeader } from '../../StyledComponents'
import { toLowerCaseMsgFields } from '../../../utils'
import { LEDGER } from '../../../constants'
import {
  fetchProvider,
  reducer,
  initialLedgerState
} from '../../../utils/ledger'
import computeSig from '../computeSig'
import ReviewMessage from './ReviewMessage'
import CreateMessage from './CreateMessage'
import ReviewMsgOnDevice from './ReviewMsgOnDevice'

const isValidForm = (toAddress, value, balance, errors) => {
  const validToAddress = validateAddressString(toAddress)
  const errorFree = !errors.value && !errors.toAddress && validToAddress
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
  const { errorFromRdx, pendingMsgs, walletProvider, walletType } = useSelector(
    state => ({
      errorFromRdx: state.error,
      pendingMsgs: state.messages.pending,
      walletProvider: state.walletProvider,
      walletType: state.walletType
    })
  )
  const [ledgerState, dispatchLocal] = useReducer(reducer, initialLedgerState)
  const [gasPrice, setGasPrice] = useState('1')
  const [gasLimit, setGasLimit] = useState('1000')

  const handleValueChange = e => {
    // clear errors for better UX
    setErrors({
      ...errors,
      value: false
    })
    // handle case where user deletes all values from text input
    if (!e.target.value) setValue('')
    // user entered non-numeric characters
    else if (
      e.target.value &&
      new FilecoinNumber(e.target.value, 'fil').isNaN()
    ) {
      setErrors({
        ...errors,
        value: 'Must pass numbers only'
      })
    }
    // when user is setting decimals
    else if (new FilecoinNumber(e.target.value, 'fil').isEqualTo(0)) {
      // dont use big numbers
      setValue(e.target.value)
    }
    // user enters a value that's greater than their balance - gas limit
    else if (
      new FilecoinNumber(e.target.value, 'fil')
        .plus(new FilecoinNumber(gasLimit, 'attofil'))
        .isGreaterThanOrEqualTo(balance)
    ) {
      setErrors({
        ...errors,
        value: "The amount must be smaller than this account's balance"
      })
      // still set the value for better feedback in the UI, but we don't allow submission of form
      setValue(new FilecoinNumber(e.target.value, 'fil'))
    }

    // handle number change
    else setValue(new FilecoinNumber(e.target.value, 'fil'))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (pendingMsgs.length > 0) {
      dispatch(
        error(
          new Error(
            'Please wait until your previous transaction confirms before submitting another.'
          )
        )
      )
      return
    }

    if (confirmStage === 'reviewMessage' && walletType === LEDGER) {
      setConfirmStage('reviewOnDevice')
    }

    try {
      let provider = walletProvider
      if (walletType === LEDGER) {
        provider = await fetchProvider(dispatchLocal, dispatch)
      }
      if (provider) {
        dispatch(clearError())
        const nonce = await provider.getNonce(selectedWallet.address)
        const message = new Message({
          to: toAddress,
          from: selectedWallet.address,
          value: value.toAttoFil(),
          method: 0,
          gasPrice,
          gasLimit,
          nonce,
          params: ''
        })
        const signature = await computeSig(
          provider,
          selectedWallet,
          message,
          walletType
        )
        const messageObj = message.encode()
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
            <CreateMessage
              toAddress={toAddress}
              setToAddress={setToAddress}
              balance={balance}
              value={value}
              handleValueChange={handleValueChange}
              errors={errors}
              isValidForm={isValidForm}
              setConfirmStage={setConfirmStage}
              setErrors={setErrors}
            />
          )}
          {confirmStage === 'reviewMessage' && (
            <ReviewMessage
              ledgerState={ledgerState}
              gasPrice={gasPrice}
              gasLimit={gasLimit}
              selectedWallet={selectedWallet}
              setGasLimit={setGasLimit}
              setGasPrice={setGasPrice}
              toAddress={toAddress}
              value={value}
              walletType={walletType}
            />
          )}

          {confirmStage === 'reviewOnDevice' && (
            <ReviewMsgOnDevice
              ledgerState={ledgerState}
              errorFromRdx={errorFromRdx}
              setConfirmStage={setConfirmStage}
              dispatchLocal={dispatchLocal}
            />
          )}
        </Form>
      </MessageCreator>
    </React.Fragment>
  )
}

export default MsgCreator
