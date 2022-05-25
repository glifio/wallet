import { useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import { Message } from '@glif/filecoin-message'
import { FilecoinNumber } from '@glif/filecoin-number'
import {
  useWallet,
  useWalletProvider,
  getMaxAffordableFee,
  getTotalAmount,
  InputV2,
  Transaction,
  LoginOption,
  TxState
} from '@glif/react-components'

import { navigate } from '../../utils/urlParams'
import { PAGE } from '../../constants'

export const Send = () => {
  const router = useRouter()
  const wallet = useWallet()
  const { loginOption } = useWalletProvider()

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
  const [txFee, setTxFee] = useState<FilecoinNumber | null>(null)

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

  // Calculate max affordable fee (balance minus value)
  const maxFee = useMemo<FilecoinNumber | null>(() => {
    return value ? getMaxAffordableFee(wallet.balance, value) : null
  }, [value, wallet.balance])

  // Calculate total amount (value plus tx fee)
  const total = useMemo<FilecoinNumber | null>(() => {
    return value && txFee ? getTotalAmount(value, txFee) : null
  }, [value, txFee])

  return (
    <Transaction.Form
      title='Send Filecoin'
      description='Please enter the message details below'
      message={message}
      total={total}
      txState={txState}
      setTxState={setTxState}
      maxFee={maxFee}
      txFee={txFee}
      setTxFee={setTxFee}
      onComplete={() => navigate(router, { pageUrl: PAGE.WALLET_HOME })}
    >
      <Transaction.Balance
        address={wallet.address}
        balance={wallet.balance}
      />
      <InputV2.Address
        label='Recipient'
        autofocus={true}
        value={toAddress}
        onBlur={setMessageIfChanged}
        onEnter={setMessageIfChanged}
        onChange={setToAddress}
        setIsValid={setIsToAddressValid}
        disabled={txState !== TxState.FillingForm}
      />
      <InputV2.Filecoin
        label='Amount'
        max={wallet.balance}
        value={value}
        denom='fil'
        onBlur={setMessageIfChanged}
        onEnter={setMessageIfChanged}
        onChange={setValue}
        setIsValid={setIsValueValid}
        disabled={txState !== TxState.FillingForm}
      />
      {loginOption !== LoginOption.LEDGER && (
        <InputV2.Params
          label='Params'
          value={params}
          onBlur={setMessageIfChanged}
          onEnter={setMessageIfChanged}
          onChange={setParams}
          setIsValid={setIsParamsValid}
          disabled={txState !== TxState.FillingForm}
        />
      )}
    </Transaction.Form>
  )
}
