import { useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { LotusMessage } from '@glif/filecoin-message'
import { FilecoinNumber } from '@glif/filecoin-number'
import { useWallet, useWalletProvider } from '@glif/wallet-provider-react'
import {
  getMaxAffordableFee,
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

  const [toAddress, setToAddress] = useState<string>('')
  const [value, setValue] = useState<FilecoinNumber | null>(null)
  const [params, setParams] = useState<string>('')
  const [txFee, setTxFee] = useState<FilecoinNumber | null>(null)
  const [isToAddressValid, setIsToAddressValid] = useState<boolean>(false)
  const [isValueValid, setIsValueValid] = useState<boolean>(false)
  const [isParamsValid, setIsParamsValid] = useState<boolean>(false)
  const [isTxFeeValid, setIsTxFeeValid] = useState<boolean>(false)
  const [isSending, setIsSending] = useState<boolean>(false)
  const [sendError, setSendError] = useState<Error | null>(null)

  const isLedger = loginOption === LoginOption.LEDGER
  const isValid =
    isToAddressValid && isValueValid && isParamsValid && isTxFeeValid

  const maxAffordableFee: FilecoinNumber | null = useMemo(() => {
    const { balance } = wallet
    return isValueValid ? getMaxAffordableFee({ balance, value }) : null
  }, [value, isValueValid, wallet.balance])

  const maxFee: FilecoinNumber | null = useMemo(() => {
    return value ? value : null
  }, [value])

  const total: FilecoinNumber | null = useMemo(() => {
    return value ? value : null
  }, [value])

  const onSend = async () => {
    setIsSending(true)
    setSendError(null)
    resetWalletError()
    const newMessage: LotusMessage = {
      To: toAddress,
      From: wallet.address,
      Nonce: await walletProvider.getNonce(wallet.address),
      Value: value.toAttoFil(),
      GasPremium: '0',
      GasLimit: 0,
      GasFeeCap: '0',
      Method: 0,
      Params: params
    }
    try {
      const signedMessage = await walletProvider.wallet.sign(
        wallet.address,
        newMessage
      )
      const msgValid = await walletProvider.simulateMessage(newMessage)
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
      {sendError && (
        <ErrorBox>Failed to send message: {sendError.message}</ErrorBox>
      )}
      {walletError() && (
        <ErrorBox>The wallet produced an error: {walletError()}</ErrorBox>
      )}
      {isSending && <Transaction.Confirm loginOption={loginOption} />}
      <ShadowBox>
        <Transaction.Header address={wallet.address} balance={wallet.balance} />
        <form>
          <InputV2.Address
            label='Recipient'
            autofocus={true}
            value={toAddress}
            onChange={setToAddress}
            setIsValid={setIsToAddressValid}
            disabled={isSending}
          />
          <InputV2.Filecoin
            label='Amount'
            max={wallet.balance}
            value={value}
            denom='fil'
            onChange={setValue}
            setIsValid={setIsValueValid}
            disabled={!isToAddressValid || isSending}
          />
          <InputV2.Params
            label='Params'
            value={params}
            onChange={setParams}
            setIsValid={setIsParamsValid}
            disabled={
              !isToAddressValid || !isValueValid || isSending || isLedger
            }
            info={
              isLedger
                ? 'Ledger devices cannot sign base64 params yet, coming soon'
                : ''
            }
          />
          <InputV2.Filecoin
            label='Transaction Fee'
            max={maxAffordableFee}
            value={txFee}
            denom='attofil'
            onChange={setTxFee}
            setIsValid={setIsTxFeeValid}
            disabled={
              !isToAddressValid || !isValueValid || !isParamsValid || isSending
            }
          />
        </form>
        {maxFee && <Transaction.MaxFee maxFee={maxFee} />}
        {total && <Transaction.Total total={total} />}
      </ShadowBox>
      <Transaction.Buttons
        cancelDisabled={isSending}
        sendDisabled={!isValid || isSending}
        onClickSend={onSend}
      />
    </Dialog>
  )
}
