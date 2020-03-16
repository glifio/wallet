import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { Box, Button, Card, Title, Input, StepCard } from '../../../Shared'

import { useWalletProvider } from '../../../../WalletProvider'
import CreateSingleKeyProvider from '../../../../WalletProvider/Subproviders/SingleKeyProvider'

export default () => {
  const { setWalletType } = useWalletProvider()
  const [privateKey, setPrivateKey] = useState('')
  const [ready, setReady] = useState(false)
  const [privateKeyError, setPrivateKeyError] = useState('')
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
      setPrivateKey('')
      setReady(false)
    }
  }, [router, wallets, network])
  return (
    <>
      {ready && (
        <CreateSingleKeyProvider
          network={network}
          privateKey={privateKey}
          ready={ready}
        />
      )}
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
          description='Please enter your seed phrase to access the accounts connected
          to your seed phrase.'
          glyphAcronym='Sp'
        />
        <Card
          width='auto'
          display='flex'
          flexDirection='column'
          justifyContent='space-between'
          borderColor='core.lightgray'
        >
          <Title mt={3}>Please input your private key below</Title>
          <Input.Text
            error={privateKeyError}
            setError={setPrivateKeyError}
            value={privateKey}
            onChange={e => setPrivateKey(e.target.value)}
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
          disabled={!!(privateKey.length === 0 || privateKeyError)}
          onClick={() => setReady(true)}
          variant='primary'
          ml={2}
        />
      </Box>
    </>
  )
}
