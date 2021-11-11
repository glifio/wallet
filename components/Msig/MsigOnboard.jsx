import React, { useState, useEffect } from 'react'
import Ledger from '../Onboarding/Configure/Ledger'
import { Box } from '../Shared'
import { useWalletProvider } from '../../WalletProvider'
import { LEDGER } from '../../constants'

const MsigOnboard = () => {
  const [mounted, setMounted] = useState(false)
  const { setLoginOption } = useWalletProvider()

  useEffect(() => {
    if (!mounted) {
      setMounted(true)
      setLoginOption(LEDGER)
    }
  }, [mounted, setMounted, setLoginOption])
  return (
    <Box
      display='flex'
      flexDirection='column'
      minHeight='100vh'
      justifyContent='center'
      alignItems='center'
      padding={[2, 3, 5]}
    >
      <Ledger msig />
    </Box>
  )
}

export default MsigOnboard
