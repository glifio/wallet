import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { useWalletProvider } from '@glif/wallet-provider-react'
import {
  useGetMessage,
  useGetReplaceMessageGasParams
} from '@glif/react-components'

export const Replace = ({ strategy }: ReplaceProps) => {
  const router = useRouter()
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
