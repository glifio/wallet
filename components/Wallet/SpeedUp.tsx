import { useRouter } from 'next/router'
import { useWalletProvider } from '@glif/wallet-provider-react'
import {
  useGetMessage,
  useGetReplaceMessageGasParams
} from '@glif/react-components'

const SpeedUp = () => {
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

export default SpeedUp
