import PropTypes from 'prop-types'
import { useState } from 'react'
import { useRouter } from 'next/router'
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
  } = useGetReplaceMessageGasParams(walletProvider, message)
  const hasError = !!(messageError || gasParamsError)
  const isLoading = messageLoading || gasParamsLoading
  const isLoaded = !!(message && gasParams)
  const isSending = step === 2

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
