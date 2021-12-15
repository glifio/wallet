import React, { useState, useEffect } from 'react'
import { useWalletProvider, ConnectLedger } from '@glif/wallet-provider-react'
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
  return <ConnectLedger back={() => {}} next={() => {}} />
}

export default MsigOnboard
