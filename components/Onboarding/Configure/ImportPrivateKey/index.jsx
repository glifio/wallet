import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import {
  Box,
  Button,
  OnboardCard,
  Title,
  Text,
  Input,
  StepHeader,
  LoadingScreen
} from '../../../Shared'

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
  const [loadingNextScreen, setLoadingNextScreen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (wallets.length > 0) {
      const params = new URLSearchParams(router.query)
      setLoadingNextScreen(true)
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
          onError={setPrivateKeyError}
          privateKey={privateKey}
          ready={ready}
        />
      )}
      {loadingNextScreen ? (
        <LoadingScreen />
      ) : (
        <Box
          display='flex'
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
        >
          <OnboardCard>
            <StepHeader
              currentStep={1}
              totalSteps={2}
              description='Import'
              glyphAcronym='Pk'
            />
            <Box
              width='auto'
              display='flex'
              flexDirection='column'
              justifyContent='space-between'
              borderColor='core.lightgray'
              m={2}
            >
              <Title mt={3}>Import</Title>
              <Text>Please input your private key below</Text>
              <Input.PrivateKey
                onKeyPress={e => {
                  e.preventDefault()
                  if (e.key === 'Enter') setReady(true)
                }}
                error={privateKeyError}
                setError={setPrivateKeyError}
                value={privateKey}
                onChange={e => setPrivateKey(e.target.value)}
              />
            </Box>
          </OnboardCard>
          <Box
            mt={6}
            display='flex'
            width='100%'
            justifyContent='space-between'
          >
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
        </Box>
      )}
    </>
  )
}
