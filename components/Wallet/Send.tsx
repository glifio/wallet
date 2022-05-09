import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { Message } from '@glif/filecoin-message'
import { FilecoinNumber, BigNumber } from '@glif/filecoin-number'
import { useWallet, useWalletProvider } from '@glif/wallet-provider-react'
import {
  getMaxAffordableFee,
  getMaxGasFee,
  getTotalAmount,
  useGetGasParams,
  useSubmittedMessages,
  InputV2,
  Dialog,
  ErrorBox,
  ShadowBox,
  StandardBox,
  Transaction,
  LoginOption,
  MessagePending
} from '@glif/react-components'

import { navigate } from '../../utils/urlParams'
import { PAGE } from '../../constants'
import { logger } from '../../logger'

enum SendState {
  FillingForm,
  LoadingTxDetails,
  AwaitingConfirmation,
  MPoolPushing
}

export const Send = () => {
  const router = useRouter()
  const wallet = useWallet()
  const { loginOption, walletProvider, walletError, getProvider } =
    useWalletProvider()
  const { pushPendingMessage } = useSubmittedMessages()

  // Input states
  const [toAddress, setToAddress] = useState<string>('')
  const [value, setValue] = useState<FilecoinNumber | null>(null)
  const [params, setParams] = useState<string>('')
  const [txFee, setTxFee] = useState<FilecoinNumber | null>(null)
  const [isToAddressValid, setIsToAddressValid] = useState<boolean>(false)
  const [isValueValid, setIsValueValid] = useState<boolean>(false)
  const [isParamsValid, setIsParamsValid] = useState<boolean>(
    // we set params to be valid when login is LEDGER
    // (since ledger device signing b64 params not supported)
    loginOption === LoginOption.LEDGER
  )
  const [isTxFeeValid, setIsTxFeeValid] = useState<boolean>(false)
  const inputsValid =
    isToAddressValid && isValueValid && isParamsValid && isTxFeeValid

  // Sending states
  const [sendState, setSendState] = useState<SendState>(SendState.FillingForm)
  const [sendError, setSendError] = useState<Error | null>(null)

  // Placeholder message for getting gas params
  const [message, setMessage] = useState<Message | null>(null)

  // Prevent redundant updates to message so that we don't
  // invoke the useGetGasParams hook more than necessary
  const setMessageIfChanged = () => {
    if (!isToAddressValid || !isValueValid || !isParamsValid) {
      setMessage(null)
      return
    }
    if (
      !message ||
      message.to !== toAddress ||
      message.value.toString() !== value.toAttoFil() ||
      message.params !== params
    )
      setMessage(
        new Message({
          to: toAddress,
          from: wallet.address,
          nonce: 0,
          value: value.toAttoFil(),
          method: 0,
          params: params,
          gasPremium: '0',
          gasFeeCap: '0',
          gasLimit: 0
        })
      )
  }

  // Max transaction fee used for getting gas params. Will be
  // null until the user manually changes the transaction fee.
  const [maxFee, setMaxFee] = useState<FilecoinNumber | null>(null)

  // Load gas parameters when message or max fee changes
  const {
    gasParams,
    loading: gasParamsLoading,
    error: gasParamsError
  } = useGetGasParams(walletProvider, message, maxFee)

  // Calculate max affordable fee (balance minus value)
  const maxAffordableFee = useMemo<FilecoinNumber | null>(() => {
    return value ? getMaxAffordableFee(wallet.balance, value) : null
  }, [value, wallet])

  // Calculate maximum transaction fee (fee cap times limit)
  const calculatedMaxFee = useMemo<FilecoinNumber | null>(() => {
    return gasParams
      ? getMaxGasFee(gasParams.gasFeeCap, gasParams.gasLimit)
      : null
  }, [gasParams])

  // Calculate total amount (value plus max fee)
  const total = useMemo<FilecoinNumber | null>(() => {
    return value && calculatedMaxFee
      ? getTotalAmount(value, calculatedMaxFee)
      : null
  }, [value, calculatedMaxFee])

  // The first time we calculate a valid maximum transaction fee, we set the value
  // for the transaction fee input. Afterwards, the transaction fee input becomes
  // editable and the calculated fee is updated according to the user's input.
  const [initialFeeSet, setInitialFeeSet] = useState<boolean>(false)
  useEffect(() => {
    if (calculatedMaxFee && !initialFeeSet) {
      setInitialFeeSet(true)
      setTxFee(calculatedMaxFee)
    }
  }, [calculatedMaxFee, initialFeeSet])

  // When leaving the transaction fee input, we set maxFee to
  // update the gas params if the following conditions are met:
  // - the input is valid
  // - the value is different from the previous max fee
  // - the value is different from the calculated max fee
  const onBlurTxFee = () => {
    if (
      txFee &&
      isTxFeeValid &&
      (!maxFee || txFee.toAttoFil() !== maxFee.toAttoFil()) &&
      (!calculatedMaxFee || txFee.toAttoFil() !== calculatedMaxFee.toAttoFil())
    ) {
      setMaxFee(txFee)
    }
  }

  const errorMsg = sendError?.message || walletError() || ''

  // Attempt sending message
  const onSend = async () => {
    setSendState(SendState.LoadingTxDetails)
    setSendError(null)
    const provider = await getProvider()
    const newMessage = new Message({
      to: message.to,
      from: message.from,
      nonce: await provider.getNonce(wallet.address),
      value: message.value,
      method: message.method,
      params: message.params,
      gasPremium: gasParams.gasPremium.toAttoFil(),
      gasFeeCap: gasParams.gasFeeCap.toAttoFil(),
      gasLimit: new BigNumber(gasParams.gasLimit.toAttoFil()).toNumber()
    })
    try {
      setSendState(SendState.AwaitingConfirmation)
      const lotusMessage = newMessage.toLotusType()
      const signedMessage = await provider.wallet.sign(
        wallet.address,
        lotusMessage
      )
      setSendState(SendState.MPoolPushing)
      const msgValid = await provider.simulateMessage(lotusMessage)
      if (!msgValid) {
        throw new Error('Filecoin message invalid. No gas or fees were spent.')
      }
      const msgCid = await provider.sendMessage(signedMessage)
      pushPendingMessage(
        newMessage.toPendingMessage(msgCid['/']) as MessagePending
      )
      navigate(router, { pageUrl: PAGE.WALLET_HOME })
    } catch (e: any) {
      logger.error(e)
      setSendState(SendState.FillingForm)
      setSendError(e)
    }
  }

  return (
    <Dialog>
      <StandardBox>
        <h2>Send Filecoin</h2>
        <hr />
        <p>Please enter the message details below</p>
      </StandardBox>
      {gasParamsError && (
        <ErrorBox>
          Failed to calculate gas fees: {gasParamsError.message}
        </ErrorBox>
      )}
      {errorMsg && <ErrorBox>{errorMsg}</ErrorBox>}
      {sendState === SendState.AwaitingConfirmation && (
        <Transaction.Confirm loginOption={loginOption as LoginOption} />
      )}
      <ShadowBox>
        <Transaction.Header address={wallet.address} balance={wallet.balance} />
        <form>
          <InputV2.Address
            label='Recipient'
            autofocus={true}
            value={toAddress}
            onBlur={setMessageIfChanged}
            onChange={setToAddress}
            setIsValid={setIsToAddressValid}
            disabled={gasParamsLoading || sendState !== SendState.FillingForm}
          />
          <InputV2.Filecoin
            label='Amount'
            max={wallet.balance}
            value={value}
            denom='fil'
            onBlur={setMessageIfChanged}
            onChange={setValue}
            setIsValid={setIsValueValid}
            disabled={gasParamsLoading || sendState !== SendState.FillingForm}
          />
          {loginOption !== LoginOption.LEDGER && (
            <InputV2.Params
              label='Params'
              value={params}
              onBlur={setMessageIfChanged}
              onChange={setParams}
              setIsValid={setIsParamsValid}
              disabled={gasParamsLoading || sendState !== SendState.FillingForm}
            />
          )}
          {initialFeeSet && (
            <InputV2.Filecoin
              label='Transaction Fee'
              max={maxAffordableFee}
              value={txFee}
              denom='attofil'
              onBlur={onBlurTxFee}
              onChange={setTxFee}
              setIsValid={setIsTxFeeValid}
              disabled={gasParamsLoading || sendState !== SendState.FillingForm}
            />
          )}
        </form>
        {gasParamsLoading && <p>Calculating transaction fees...</p>}
        {calculatedMaxFee && <Transaction.MaxFee maxFee={calculatedMaxFee} />}
        {total && <Transaction.Total total={total} />}
      </ShadowBox>
      <Transaction.Buttons
        cancelDisabled={sendState !== SendState.FillingForm}
        sendDisabled={
          !total || !inputsValid || sendState !== SendState.FillingForm
        }
        onClickSend={onSend}
      />
    </Dialog>
  )
}
