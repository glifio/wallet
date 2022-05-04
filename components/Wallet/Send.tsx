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
  InputV2,
  Dialog,
  ErrorBox,
  ShadowBox,
  StandardBox,
  Transaction,
  LoginOption
} from '@glif/react-components'

import { navigate } from '../../utils/urlParams'
import { PAGE } from '../../constants'
import { logger } from '../../logger'

export const Send = () => {
  const router = useRouter()
  const wallet = useWallet()
  const { loginOption, walletProvider, walletError, resetWalletError } =
    useWalletProvider()

  // Input states
  const [toAddress, setToAddress] = useState<string>('')
  const [value, setValue] = useState<FilecoinNumber | null>(null)
  const [params, setParams] = useState<string>('')
  const [txFee, setTxFee] = useState<FilecoinNumber | null>(null)
  const [isToAddressValid, setIsToAddressValid] = useState<boolean>(false)
  const [isValueValid, setIsValueValid] = useState<boolean>(false)
  const [isParamsValid, setIsParamsValid] = useState<boolean>(false)
  const [isTxFeeValid, setIsTxFeeValid] = useState<boolean>(false)
  const inputsValid =
    isToAddressValid && isValueValid && isParamsValid && isTxFeeValid

  // Sending states
  const [isSending, setIsSending] = useState<boolean>(false)
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

  // Load gas parameters
  const [maxFee, setMaxFee] = useState<FilecoinNumber | null>(null)
  const {
    gasParams,
    loading: gasParamsLoading,
    error: gasParamsError
  } = useGetGasParams(walletProvider, message, maxFee)

  // Data states
  const isLoaded = !!gasParams

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

  // Attempt sending message
  const onSend = async () => {
    setIsSending(true)
    setSendError(null)
    resetWalletError()
    const newMessage = new Message({
      to: message.to,
      from: message.from,
      nonce: await walletProvider.getNonce(wallet.address),
      value: message.value,
      method: message.method,
      params: message.params,
      gasPremium: gasParams.gasPremium.toAttoFil(),
      gasFeeCap: gasParams.gasFeeCap.toAttoFil(),
      gasLimit: new BigNumber(gasParams.gasLimit.toAttoFil()).toNumber()
    })
    try {
      const lotusMessage = newMessage.toLotusType()
      const signedMessage = await walletProvider.wallet.sign(
        wallet.address,
        lotusMessage
      )
      const msgValid = await walletProvider.simulateMessage(lotusMessage)
      if (!msgValid) {
        throw new Error('Filecoin message invalid. No gas or fees were spent.')
      }
      await walletProvider.sendMessage(signedMessage)
      navigate(router, { pageUrl: PAGE.WALLET_HOME })
    } catch (e: any) {
      logger.error(e)
      setSendError(e)
    }
    setIsSending(false)
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
      {sendError && (
        <ErrorBox>Failed to send message: {sendError.message}</ErrorBox>
      )}
      {walletError() && (
        <ErrorBox>The wallet produced an error: {walletError()}</ErrorBox>
      )}
      {isSending && (
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
            disabled={isSending}
          />
          <InputV2.Filecoin
            label='Amount'
            max={wallet.balance}
            value={value}
            denom='fil'
            onBlur={setMessageIfChanged}
            onChange={setValue}
            setIsValid={setIsValueValid}
            disabled={isSending}
          />
          <InputV2.Params
            label='Params'
            value={params}
            onBlur={setMessageIfChanged}
            onChange={setParams}
            setIsValid={setIsParamsValid}
            disabled={loginOption === LoginOption.LEDGER || isSending}
            info={
              loginOption === LoginOption.LEDGER
                ? 'Ledger devices cannot sign base64 params yet, coming soon'
                : ''
            }
          />
          <InputV2.Filecoin
            label='Transaction Fee'
            max={maxAffordableFee}
            value={txFee}
            denom='attofil'
            onBlur={() => setMaxFee(txFee)}
            onChange={setTxFee}
            setIsValid={setIsTxFeeValid}
            disabled={!initialFeeSet || gasParamsLoading || isSending}
          />
        </form>
        {gasParamsLoading && <p>Calculating transaction fees...</p>}
        {calculatedMaxFee && <Transaction.MaxFee maxFee={calculatedMaxFee} />}
        {total && <Transaction.Total total={total} />}
      </ShadowBox>
      <Transaction.Buttons
        cancelDisabled={isSending}
        sendDisabled={!isLoaded || !inputsValid || isSending}
        onClickSend={onSend}
      />
    </Dialog>
  )
}
