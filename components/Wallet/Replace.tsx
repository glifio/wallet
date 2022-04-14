import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { FilecoinNumber } from '@glif/filecoin-number'
import {
  useWallet,
  useWalletProvider,
  useGetMessage,
  useGetReplaceMessageGasParams
} from '@glif/wallet-provider-react'
import {
  ButtonV2,
  InputV2,
  Dialog,
  ErrorBox,
  ShadowBox,
  StandardBox,
  ButtonRowSpaced,
  StepHeader,
  SmartLink
} from '@glif/react-components'

import { CardHeader } from './Send/CardHeader'

export const Replace = ({ strategy }: ReplaceProps) => {
  const router = useRouter()
  const wallet = useWallet()
  const cid = router.query.cid as string
  const stepCount = 2
  const [step, setStep] = useState<number>(1)
  const [expert, setExpert] = useState<boolean>(false)
  const [gasPremium, setGasPremium] = useState<FilecoinNumber>(new FilecoinNumber(0, 'attofil'))
  const [gasLimit, setGasLimit] = useState<FilecoinNumber>(new FilecoinNumber(0, 'attofil'))
  const [feeCap, setFeeCap] = useState<FilecoinNumber>(new FilecoinNumber(0, 'attofil'))
  const { walletProvider } = useWalletProvider()
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
  const hasError = !!(messageError || gasParamsError || minGasParamsError)
  const isLoading = messageLoading || gasParamsLoading || minGasParamsLoading
  const isLoaded = !!(message && gasParams && minGasParams)
  const isSending = step === 2

  useEffect(() => {
    if (!expert && gasParams) {
      setGasPremium(new FilecoinNumber(gasParams.gasPremium, 'attofil'))
      setGasLimit(new FilecoinNumber(gasParams.gasLimit, 'attofil'))
      setFeeCap(new FilecoinNumber(gasParams.gasFeeCap, 'attofil'))
    }
  }, [expert, gasParams])

  function getGlyph() {
    switch (strategy) {
      case ReplaceStrategy.SPEED_UP:
        return 'Su'
      case ReplaceStrategy.CANCEL:
        return 'Ca'
      default:
        return ''
    }
  }

  function getTitle() {
    switch (strategy) {
      case ReplaceStrategy.SPEED_UP:
        return 'Speed Up Message'
      case ReplaceStrategy.CANCEL:
        return 'Cancel Message'
      default:
        return ''
    }
  }

  function getDescription() {
    if (hasError) return ''
    if (isLoading) return 'Loading message information...'
    switch (step) {
      case 1:
        return 'Please confirm the transaction details below'
      case 2:
        return 'Please confirm the transaction with your wallet provider'
      default:
        return ''
    }
  }

  return (
    <Dialog>
      <StandardBox>
        <StepHeader
          title={getTitle()}
          currentStep={step}
          totalSteps={stepCount}
          glyphAcronym={getGlyph()}
          showStepper={isLoaded}
        />
        {!hasError && <p>{getDescription()}</p>}
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
