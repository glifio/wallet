import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Ledger from '../Onboarding/Configure/Ledger'
import { Box } from '../Shared'
import EnterId from './InvestorId'
import { useWalletProvider } from '../../WalletProvider'
import { LEDGER } from '../../constants'

export default () => {
  const { investor } = useSelector(state => ({
    investor: state.investor
  }))
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
      {investor ? <Ledger investor /> : <EnterId />}
    </Box>
  )
}
