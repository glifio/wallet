import React, { useState, useEffect } from 'react'
import Ledger from '../Onboarding/Configure/Ledger'
import { Box } from '../Shared'
import { useWalletProvider } from '../../WalletProvider'
import { LEDGER } from '../../constants'

export default () => {
  const [mounted, setMounted] = useState(false)
  const { setWalletType } = useWalletProvider()

  useEffect(() => {
    if (!mounted) {
      setMounted(true)
      setWalletType(LEDGER)
    }
  }, [mounted, setMounted, setWalletType])
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
