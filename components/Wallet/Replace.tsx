import PropTypes from 'prop-types'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { LotusMessage } from '@glif/filecoin-message'
import { BigNumber, FilecoinNumber } from '@glif/filecoin-number'
import {
  Transaction,
  getMaxGasFee,
  useWallet,
  useWalletProvider,
  useGetMessage,
  useGetReplaceMessageGasParams
} from '@glif/wallet-provider-react'
import {
  InputV2,
  Dialog,
  ErrorBox,
  ShadowBox,
  StandardBox
} from '@glif/react-components'

import { navigate } from '../../utils/urlParams'
import { PAGE } from '../../constants'
import { logger } from '../../logger'

export const Replace = ({ strategy }: ReplaceProps) => {
  const router = useRouter()
  const wallet = useWallet()
  const cid = router.query.cid as string
  const { walletProvider, walletError, resetWalletError } = useWalletProvider()

  const [expert, setExpert] = useState<boolean>(false)
  const [gasPremium, setGasPremium] = useState<FilecoinNumber | null>(null)
  const [gasLimit, setGasLimit] = useState<FilecoinNumber | null>(null)
  const [gasFeeCap, setGasFeeCap] = useState<FilecoinNumber | null>(null)
  const [isGasPremiumValid, setIsGasPremiumValid] = useState<boolean>(false)
  const [isGasLimitValid, setIsGasLimitValid] = useState<boolean>(false)
  const [isGasFeeCapValid, setIsGasFeeCapValid] = useState<boolean>(false)
  const [isSending, setIsSending] = useState<boolean>(false)
  const [sendError, setSendError] = useState<Error | null>(null)

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

  const hasLoadError = !!(messageError || gasParamsError || minGasParamsError)
  const isLoading = messageLoading || gasParamsLoading || minGasParamsLoading
  const isLoaded = !!(message && gasParams && minGasParams)
  const isValid = isGasPremiumValid && isGasLimitValid && isGasFeeCapValid

  const maxFee: FilecoinNumber | null = useMemo(() => {
    return gasLimit && gasFeeCap ? getMaxGasFee({ gasLimit, gasFeeCap }) : null
  }, [gasLimit, gasFeeCap])

  useEffect(() => {
    if (!expert && gasParams) {
      setGasPremium(gasParams.gasPremium)
      setGasLimit(gasParams.gasLimit)
      setGasFeeCap(gasParams.gasFeeCap)
    }
  }, [expert, gasParams])

  const onSend = async () => {
    setIsSending(true)
    setSendError(null)
    resetWalletError()
    const newMessage: LotusMessage = {
      ...message,
      GasPremium: gasPremium.toAttoFil(),
      GasFeeCap: gasFeeCap.toAttoFil(),
      GasLimit: new BigNumber(gasLimit.toAttoFil()).toNumber(),
      ...(strategy === ReplaceStrategy.CANCEL
        ? {
            Value: '0',
            Method: 0,
            Params: ''
          }
        : {})
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

  const getTitle = () => {
    switch (strategy) {
      case ReplaceStrategy.SPEED_UP:
        return 'Speed Up Message'
      case ReplaceStrategy.CANCEL:
        return 'Cancel Message'
      default:
        return ''
    }
  }

  const getDescription = () => {
    if (hasLoadError) return 'Failed to load message information'
    if (isLoading) return 'Loading message information...'
    if (isSending)
      return 'Please confirm the transaction with your wallet provider'
    return 'Please confirm the updated message details below'
  }

  return (
    <Dialog>
      <StandardBox>
        <h2>{getTitle()}</h2>
        <hr />
        <p>{getDescription()}</p>
      </StandardBox>
      {messageError && (
        <ErrorBox>Failed to retrieve message: {messageError.message}</ErrorBox>
      )}
      {gasParamsError && (
        <ErrorBox>
          Failed to calculate gas fees: {gasParamsError.message}
        </ErrorBox>
      )}
      {minGasParamsError && (
        <ErrorBox>
          Failed to calculate minimum gas fees: {minGasParamsError.message}
        </ErrorBox>
      )}
      {sendError && (
        <ErrorBox>Failed to send message: {sendError.message}</ErrorBox>
      )}
      {walletError() && (
        <ErrorBox>The wallet produced an error: {walletError()}</ErrorBox>
      )}
      {isLoaded && (
        <ShadowBox>
          <Transaction.Header
            address={wallet.address}
            balance={wallet.balance}
          />
          <form>
            <InputV2.Text label='Message CID' value={cid} disabled />
            <InputV2.Text label='Nonce' value={message.Nonce} disabled />
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
              disabled={!expert || isSending}
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
              disabled={!expert || isSending}
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
              disabled={!expert || isSending}
            />
            <InputV2.Toggle
              label='Expert Mode'
              checked={expert}
              onChange={setExpert}
              disabled={isSending}
            />
          </form>
          {maxFee && <Transaction.MaxFee maxFee={maxFee} />}
        </ShadowBox>
      )}
      <Transaction.Buttons
        cancelDisabled={isSending}
        sendDisabled={!isLoaded || !isValid || isSending}
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
