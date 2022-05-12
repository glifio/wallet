import PropTypes from 'prop-types'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { Message } from '@glif/filecoin-message'
import { BigNumber, FilecoinNumber } from '@glif/filecoin-number'
import { useWallet, useWalletProvider } from '@glif/wallet-provider-react'
import {
  getMaxGasFee,
  useGetMessage,
  useGetReplaceMessageGasParams,
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

export const Replace = ({ strategy }: ReplaceProps) => {
  const router = useRouter()
  const wallet = useWallet()
  const cid = router.query.cid as string
  const { pushPendingMessage } = useSubmittedMessages()
  const { loginOption, walletProvider, walletError, getProvider } =
    useWalletProvider()

  // Input states
  const [expert, setExpert] = useState<boolean>(false)
  const [gasPremium, setGasPremium] = useState<FilecoinNumber | null>(null)
  const [gasLimit, setGasLimit] = useState<FilecoinNumber | null>(null)
  const [gasFeeCap, setGasFeeCap] = useState<FilecoinNumber | null>(null)
  const [isGasPremiumValid, setIsGasPremiumValid] = useState<boolean>(false)
  const [isGasLimitValid, setIsGasLimitValid] = useState<boolean>(false)
  const [isGasFeeCapValid, setIsGasFeeCapValid] = useState<boolean>(false)
  const inputsValid = isGasPremiumValid && isGasLimitValid && isGasFeeCapValid

  // Sending states
  const [sendState, setSendState] = useState<TxState>(TxState.FillingForm)
  const [sendError, setSendError] = useState<Error | null>(null)

  // Load data
  const {
    message,
    loading: messageLoading,
    error: messageError
  } = useGetMessage(cid)
  const {
    gasParams,
    loading: gasParamsLoading,
    error: gasParamsError
  } = useGetReplaceMessageGasParams(walletProvider, message, false)
  const {
    gasParams: minGasParams,
    loading: minGasParamsLoading,
    error: minGasParamsError
  } = useGetReplaceMessageGasParams(walletProvider, message, true)

  // Data states
  const hasLoadError = !!(messageError || gasParamsError || minGasParamsError)
  const isLoading = messageLoading || gasParamsLoading || minGasParamsLoading
  const isLoaded = !!(message && gasParams && minGasParams)

  // Calculate maximum transaction fee
  const maxFee = useMemo<FilecoinNumber | null>(() => {
    return gasLimit && gasFeeCap ? getMaxGasFee(gasFeeCap, gasLimit) : null
  }, [gasLimit, gasFeeCap])

  // Set default gas params after loading
  // the data or disabling expert mode
  useEffect(() => {
    if (!expert && gasParams) {
      setGasPremium(gasParams.gasPremium)
      setGasLimit(gasParams.gasLimit)
      setGasFeeCap(gasParams.gasFeeCap)
    }
  }, [expert, gasParams])

  // Attempt sending message
  const onSend = async () => {
    setSendState(TxState.LoadingTxDetails)
    setSendError(null)
    const provider = await getProvider()
    const cancel = strategy === ReplaceStrategy.CANCEL
    const newMessage = new Message({
      to: message.to,
      from: message.from,
      nonce: message.nonce,
      value: cancel ? '0' : message.value,
      method: cancel ? 0 : message.method,
      params: cancel ? '' : message.params,
      gasPremium: gasPremium.toAttoFil(),
      gasFeeCap: gasFeeCap.toAttoFil(),
      gasLimit: new BigNumber(gasLimit.toAttoFil()).toNumber()
    })
    try {
      setSendState(TxState.AwaitingConfirmation)
      const lotusMessage = newMessage.toLotusType()
      const signedMessage = await provider.wallet.sign(
        wallet.address,
        lotusMessage
      )
      setSendState(TxState.MPoolPushing)
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
      setSendState(TxState.FillingForm)
      setSendError(e)
    }
  }

  return (
    <Dialog>
      <Transaction.Header
        txState={sendState}
        title={
          strategy === ReplaceStrategy.SPEED_UP
            ? 'Speed Up Message'
            : 'Cancel Message'
        }
        description={'Please confirm the updated message details below'}
        loginOption={loginOption as LoginOption}
        errorMessage={
          messageError?.message ||
          gasParamsError?.message ||
          minGasParamsError?.message ||
          sendError?.message ||
          walletError() ||
          ''
        }
      />
      {isLoaded && (
        <ShadowBox>
          <Transaction.Balance
            address={wallet.address}
            balance={wallet.balance}
          />
          <form>
            <InputV2.Text label='Message CID' value={cid} disabled />
            <InputV2.Number label='Nonce' value={message.nonce} disabled />
            <InputV2.Filecoin
              label='Gas Premium'
              info={
                expert
                  ? `Needs to be at least ${minGasParams.gasPremium.toAttoFil()} aFIL`
                  : ''
              }
              min={minGasParams.gasPremium}
              value={gasPremium}
              denom='attofil'
              onChange={setGasPremium}
              setIsValid={setIsGasPremiumValid}
              disabled={!expert || sendState !== TxState.FillingForm}
            />
            <InputV2.Filecoin
              label='Gas Limit'
              info={
                expert
                  ? `Needs to be at least ${minGasParams.gasLimit.toAttoFil()} aFIL`
                  : ''
              }
              min={minGasParams.gasLimit}
              value={gasLimit}
              denom='attofil'
              onChange={setGasLimit}
              setIsValid={setIsGasLimitValid}
              disabled={!expert || sendState !== TxState.FillingForm}
            />
            <InputV2.Filecoin
              label='Fee Cap'
              info={
                expert
                  ? `Needs to be at least ${minGasParams.gasFeeCap.toAttoFil()} aFIL`
                  : ''
              }
              min={minGasParams.gasFeeCap}
              value={gasFeeCap}
              denom='attofil'
              onChange={setGasFeeCap}
              setIsValid={setIsGasFeeCapValid}
              disabled={!expert || sendState !== TxState.FillingForm}
            />
            <InputV2.Toggle
              label='Expert Mode'
              checked={expert}
              onChange={setExpert}
              disabled={sendState !== TxState.FillingForm}
            />
          </form>
          {maxFee && <Transaction.MaxFee maxFee={maxFee} />}
        </ShadowBox>
      )}
      <Transaction.Buttons
        cancelDisabled={sendState !== TxState.FillingForm}
        sendDisabled={
          !isLoaded || !inputsValid || sendState !== TxState.FillingForm
        }
        onClickSend={onSend}
      />
    </Dialog>
  )
}

export enum ReplaceStrategy {
  SPEED_UP = 'SPEED_UP',
  CANCEL = 'CANCEL'
}

interface ReplaceProps {
  strategy: ReplaceStrategy
}

Replace.propTypes = {
  strategy: PropTypes.string.isRequired
}
