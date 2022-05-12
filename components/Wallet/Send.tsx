import { useState, useMemo } from 'react'
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
  ShadowBox,
  Transaction,
  LoginOption,
  MessagePending,
  TxState
} from '@glif/react-components'

import { navigate } from '../../utils/urlParams'
import { PAGE } from '../../constants'
import { logger } from '../../logger'

export const Send = () => {
  const router = useRouter()
  const wallet = useWallet()
  const { pushPendingMessage } = useSubmittedMessages()
  const { loginOption, walletProvider, walletError, getProvider } =
    useWalletProvider()

  // Input states
  const [toAddress, setToAddress] = useState<string>('')
  const [value, setValue] = useState<FilecoinNumber | null>(null)
  const [params, setParams] = useState<string>('')
  const [isToAddressValid, setIsToAddressValid] = useState<boolean>(false)
  const [isValueValid, setIsValueValid] = useState<boolean>(false)
  const [isParamsValid, setIsParamsValid] = useState<boolean>(
    // we set params to be valid when login is LEDGER
    // (since ledger device signing b64 params not supported)
    loginOption === LoginOption.LEDGER
  )

  // Transaction states
  const [txState, setTxState] = useState<TxState>(TxState.FillingForm)
  const [txError, setTxError] = useState<Error | null>(null)

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
          gasPremium: 0,
          gasFeeCap: 0,
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
  const affordableFee = useMemo<FilecoinNumber | null>(() => {
    return value ? getMaxAffordableFee(wallet.balance, value) : null
  }, [value, wallet.balance])

  // Calculate maximum transaction fee (fee cap times limit)
  const calculatedFee = useMemo<FilecoinNumber | null>(() => {
    return gasParams
      ? getMaxGasFee(gasParams.gasFeeCap, gasParams.gasLimit)
      : null
  }, [gasParams])

  // Calculate total amount (value plus max fee)
  const total = useMemo<FilecoinNumber | null>(() => {
    return value && calculatedFee ? getTotalAmount(value, calculatedFee) : null
  }, [value, calculatedFee])

  // Attempt sending message
  const onSend = async () => {
    setTxState(TxState.LoadingTxDetails)
    setTxError(null)
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
      setTxState(TxState.AwaitingConfirmation)
      const lotusMessage = newMessage.toLotusType()
      const signedMessage = await provider.wallet.sign(
        wallet.address,
        lotusMessage
      )
      setTxState(TxState.MPoolPushing)
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
      setTxState(TxState.FillingForm)
      setTxError(e)
    }
  }

  return (
    <Dialog>
      <Transaction.Header
        txState={txState}
        title='Send Filecoin'
        description='Please enter the message details below'
        loginOption={loginOption as LoginOption}
        errorMessage={
          gasParamsError?.message || txError?.message || walletError() || ''
        }
      />
      <ShadowBox>
        <Transaction.Balance
          address={wallet.address}
          balance={wallet.balance}
        />
        <form>
          <InputV2.Address
            label='Recipient'
            autofocus={true}
            value={toAddress}
            onBlur={setMessageIfChanged}
            onChange={setToAddress}
            setIsValid={setIsToAddressValid}
            disabled={gasParamsLoading || txState !== TxState.FillingForm}
          />
          <InputV2.Filecoin
            label='Amount'
            max={wallet.balance}
            value={value}
            denom='fil'
            onBlur={setMessageIfChanged}
            onChange={setValue}
            setIsValid={setIsValueValid}
            disabled={gasParamsLoading || txState !== TxState.FillingForm}
          />
          {loginOption !== LoginOption.LEDGER && (
            <InputV2.Params
              label='Params'
              value={params}
              onBlur={setMessageIfChanged}
              onChange={setParams}
              setIsValid={setIsParamsValid}
              disabled={gasParamsLoading || txState !== TxState.FillingForm}
            />
          )}
          <Transaction.Fee
            maxFee={maxFee}
            setMaxFee={setMaxFee}
            affordableFee={affordableFee}
            calculatedFee={calculatedFee}
            gasLoading={gasParamsLoading}
            disabled={gasParamsLoading || txState !== TxState.FillingForm}
          />
        </form>
        {total && <Transaction.Total total={total} />}
      </ShadowBox>
      <Transaction.Buttons
        cancelDisabled={txState !== TxState.FillingForm}
        sendDisabled={txState !== TxState.FillingForm || !total}
        onClickSend={onSend}
      />
    </Dialog>
  )
}
