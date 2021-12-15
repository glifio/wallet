import React, { useCallback } from 'react'
import { ConnectCreateSeed } from '@glif/wallet-provider-react'
import { Box } from '@glif/react-components'
import { useRouter } from 'next/router'
import useReset from '../../../utils/useReset'
import { navigate } from '../../../utils/urlParams'
import { PAGE } from '../../../constants'

export default function CreateSeed() {
  const router = useRouter()
  const resetState = useReset()
  const back = useCallback(() => {
    router.replace('/')
    resetState()
  }, [router, resetState])

  const next = useCallback(() => {
    navigate(router, { pageUrl: PAGE.WALLET_HOME })
  }, [router])

  return (
    <Box
      display='flex'
      minHeight='100vh'
      justifyContent='center'
      alignContent='center'
      padding={[2, 3, 5]}
    >
      <ConnectCreateSeed back={back} next={next} />
    </Box>
  )
}