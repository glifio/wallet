import PropTypes from 'prop-types'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { Message } from '@glif/filecoin-message'
import { BigNumber, FilecoinNumber } from '@glif/filecoin-number'
import {
  getMaxGasFee,
  useGetMessage,
  useGetReplaceMessageGasParams,
  useSubmittedMessages,
  SmartLink,
  InputV2,
  Dialog,
  ShadowBox,
  Transaction,
  LoginOption,
  MessagePending,
  TxState,
  useWallet,
  useWalletProvider
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

  // Transaction states
  const [txState, setTxState] = useState<TxState>(TxState.LoadingMessage)
  const [txError, setTxError] = useState<Error | null>(null)

  // Load data
  const { message, error: messageError } = useGetMessage(cid)
  const { gasParams, error: gasParamsError } = useGetReplaceMessageGasParams(
    walletProvider,
    message,
    false
  )
  const { gasParams: minGasParams, error: minGasParamsError } =
    useGetReplaceMessageGasParams(walletProvider, message, true)

  // Set transaction state to FillingForm when all data has loaded
  useEffect(
    () =>
      txState === TxState.LoadingMessage &&
      message &&
      gasParams &&
      minGasParams &&
      setTxState(TxState.FillingForm),
    [txState, message, gasParams, minGasParams]
  )

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
    setTxState(TxState.LoadingTxDetails)
    setTxError(null)
    const cancel = strategy === ReplaceStrategy.CANCEL
    try {
      const provider = await getProvider()
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
          txError?.message ||
          walletError() ||
          ''
        }
      />
      {txState !== TxState.LoadingMessage && (
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
              disabled={!expert || txState !== TxState.FillingForm}
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
              disabled={!expert || txState !== TxState.FillingForm}
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
              disabled={!expert || txState !== TxState.FillingForm}
            />
            <InputV2.Toggle
              label='Expert Mode'
              checked={expert}
              onChange={setExpert}
              disabled={txState !== TxState.FillingForm}
            />
          </form>
          {maxFee && (
            <p>
              You will not pay more than {maxFee.toFil()} FIL for this transaction.{' '}
              <SmartLink href='https://filfox.info/en/stats/gas'>
                More information on average gas fee statistics.
              </SmartLink>
            </p>
          )}
        </ShadowBox>
      )}
      <Transaction.Buttons
        cancelDisabled={txState !== TxState.FillingForm}
        sendDisabled={txState !== TxState.FillingForm || !inputsValid}
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
