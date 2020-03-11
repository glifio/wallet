import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { validateMnemonic } from 'bip39'
import { Box, Button, Card, Text, Input, StepCard } from '../../../Shared'

import { useWalletProvider } from '../../../../WalletProvider'
import CreateProvider from '../../../../WalletProvider/CreateProvider'

export default () => {
  const { setWalletType } = useWalletProvider()
  const [seed, setSeed] = useState('')
  const [validSeed, setValidSeed] = useState('')
  const [seedError, setSeedError] = useState('')
  const { network, wallets } = useSelector(state => ({
    network: state.network,
    wallets: state.wallets
  }))
  const router = useRouter()

  useEffect(() => {
    if (wallets.length > 0) {
      const params = new URLSearchParams(router.query)
      router.push(`/wallet?${params.toString()}`)
    }
    return () => {
      setSeed('')
      setValidSeed('')
    }
  }, [router, wallets, network])
  return (
    <>
      <CreateProvider
        network={network}
        mnemonic={validSeed}
        ready={!!validSeed}
      />
      <Box
        mt={8}
        mb={6}
        display='flex'
        flexDirection='row'
        justifyContent='center'
      >
        <StepCard
          currentStep={1}
          totalSteps={2}
          description='Please enter your 12 word seed phrase to access the accounts connected
          to your seed phrase.'
          glyphAcronym='Sp'
        />
        <Card
          width='auto'
          display='flex'
          flexDirection='column'
          justifyContent='space-between'
        >
          <Text>Please input your 12-word seed phrase below</Text>
          <Input.Seed
            error={seedError}
            setError={setSeedError}
            value={seed}
            onChange={e => setSeed(e.target.value)}
          />
        </Card>
      </Box>
      <Box mt={6} display='flex' flexDirection='row' justifyContent='center'>
        <Button
          title='Back'
          onClick={() => setWalletType(null)}
          variant='secondary'
          mr={2}
        />
        <Button
          title='Next'
          disabled={!!(seed.length === 0 || seedError)}
          onClick={() => {
            try {
              const isValid = validateMnemonic(seed)
              if (isValid) setValidSeed(seed)
            } catch (_) {
              setSeedError('Invalid seed phrase.')
            }
          }}
          variant='primary'
          ml={2}
        />
      </Box>
    </>
  )
}
