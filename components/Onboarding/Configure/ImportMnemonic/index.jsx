import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { validateMnemonic } from 'bip39'
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
import CreateHDWalletProvider from '../../../../WalletProvider/Subproviders/HDWalletProvider'

export default () => {
  const { setWalletType } = useWalletProvider()
  const [mnemonic, setMnemonic] = useState('')
  const [validMnemonic, setValidMnemonic] = useState('')
  const [mnemonicError, setMnemonicError] = useState('')
  const [loadingNextScreen, setLoadingNextScreen] = useState(false)
  const { network, wallets } = useSelector(state => ({
    network: state.network,
    wallets: state.wallets
  }))
  const router = useRouter()

  useEffect(() => {
    if (wallets.length > 0) {
      const params = new URLSearchParams(router.query)
      setLoadingNextScreen(true)
      router.push(`/wallet?${params.toString()}`)
    }
    return () => {
      setMnemonic('')
      setValidMnemonic('')
    }
  }, [router, wallets, network])
  return (
    <>
      {validMnemonic && (
        <CreateHDWalletProvider
          mnemonic={validMnemonic}
          ready={!!validMnemonic}
        />
      )}
      {loadingNextScreen ? (
        <LoadingScreen />
      ) : (
        <Box display='flex' flexDirection='column' justifyContent='center'>
          <OnboardCard>
            <StepHeader
              currentStep={1}
              totalSteps={2}
              glyphAcronym='Sp'
              m={2}
            />

            <Title mt={3}>Input, Import & Proceed</Title>
            <Text>
              Please input your 12 or 24 word seed phrase below to continue{' '}
            </Text>
            <Input.Mnemonic
              error={mnemonicError}
              setError={setMnemonicError}
              value={mnemonic}
              onChange={e => setMnemonic(e.target.value)}
            />
          </OnboardCard>
          <Box
            mt={6}
            display='flex'
            flexDirection='row'
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
              disabled={!!(mnemonic.length === 0 || mnemonicError)}
              onClick={() => {
                try {
                  const isValid = validateMnemonic(mnemonic)
                  if (isValid) setValidMnemonic(mnemonic)
                } catch (_) {
                  setMnemonicError('Invalid seed phrase.')
                }
              }}
              variant='primary'
              ml={2}
            />
          </Box>
        </Box>
      )}
    </>
  )
}
