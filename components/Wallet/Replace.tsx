import PropTypes from 'prop-types'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useWalletProvider } from '@glif/wallet-provider-react'
import {
  ButtonV2,
  Dialog,
  ErrorBox,
  ShadowBox,
  StandardBox,
  ButtonRowSpaced,
  StepHeader,
  useGetMessage,
  useGetReplaceMessageGasParams
} from '@glif/react-components'

export const Replace = ({ strategy }: ReplaceProps) => {
  const router = useRouter()
  const stepCount = 2
  const [step, setStep] = useState<number>(1)
  const [expert, setExpert] = useState<boolean>(false)
  const { walletProvider } = useWalletProvider()
  const {
    message,
    loading: messageLoading,
    error: messageError
  } = useGetMessage(router.query.cid)
  const {
    gasParams,
    loading: gasParamsLoading,
    error: gasParamsError
  } = useGetReplaceMessageGasParams(walletProvider, message)
  const hasError = !!(messageError || gasParamsError)
  const isLoading = messageLoading || gasParamsLoading
  const isLoaded = !!(message && gasParams)
  
  function getGlyph() {
    switch(strategy) {
      case ReplaceStrategy.SPEED_UP:
        return 'Su'
      case ReplaceStrategy.CANCEL:
        return 'Ca'
      default:
        return ''
    }
  }
  
  function getTitle() {
    switch(strategy) {
      case ReplaceStrategy.SPEED_UP:
        return 'Speed Up Message'
      case ReplaceStrategy.CANCEL:
        return 'Cancel Message'
      default:
        return ''
    }
  }

  return <form></form>
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
