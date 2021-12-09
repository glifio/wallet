import React, { useState, useEffect } from 'react'
import { Box, useWalletProvider } from '@glif/react-components'
import Ledger from '../Onboarding/Configure/Ledger'
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
