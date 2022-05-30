import PropTypes from 'prop-types'
import { useState, useMemo, Context } from 'react'
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
  TxState,
  WalletProviderOpts,
  PendingMsgContextType
} from '@glif/react-components'

import { navigate } from '../../utils/urlParams'
import { PAGE } from '../../constants'

export const Send = ({
  walletProviderOpts,
  pendingMsgContext
}: SendProps) => {
  const router = useRouter()
  const wallet = useWallet()
  const { loginOption } = useWalletProvider(walletProviderOpts)

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

  // Create message from input
  const message = useMemo<Message | null>(
    () =>
      isToAddressValid && isValueValid && isParamsValid && value
        ? new Message({
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
        : null,
    [
      isToAddressValid,
      isValueValid,
      isParamsValid,
      toAddress,
      wallet.address,
      value,
      params
    ]
  )

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
      walletProviderOpts={walletProviderOpts}
      pendingMsgContext={pendingMsgContext}
    >
      <Transaction.Balance address={wallet.address} balance={wallet.balance} />
      <InputV2.Address
        label='Recipient'
        autofocus={true}
        value={toAddress}
        onChange={setToAddress}
        setIsValid={setIsToAddressValid}
        disabled={txState !== TxState.FillingForm}
      />
      <InputV2.Filecoin
        label='Amount'
        max={wallet.balance}
        value={value}
        denom='fil'
        onChange={setValue}
        setIsValid={setIsValueValid}
        disabled={txState !== TxState.FillingForm}
      />
      {loginOption !== LoginOption.LEDGER && (
        <InputV2.Params
          label='Params'
          value={params}
          onChange={setParams}
          setIsValid={setIsParamsValid}
          disabled={txState !== TxState.FillingForm}
        />
      )}
    </Transaction.Form>
  )
}

type SendProps = {
  walletProviderOpts?: WalletProviderOpts
  pendingMsgContext?: Context<PendingMsgContextType>
}

Send.propTypes = {
  walletProviderOpts: PropTypes.object,
  pendingMsgContext: PropTypes.object,
}
