import React, { useState } from 'react'
import Filecoin from '@openworklabs/filecoin-wallet-provider'
import { useDispatch } from 'react-redux'
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
import { walletList } from '../../../../store/actions'
import { useWalletProvider } from '../../../../WalletProvider'
import { createWalletProvider } from '../../../../WalletProvider/state'

export default () => {
  const {
    dispatch,
    fetchDefaultWallet,
    setWalletType,
    walletSubproviders
  } = useWalletProvider()
  const [mnemonic, setMnemonic] = useState('')
  const [mnemonicError, setMnemonicError] = useState('')
  const [loadingNextScreen, setLoadingNextScreen] = useState(false)
  const dispatchRdx = useDispatch()
  const router = useRouter()

  const instantiateProvider = async () => {
    setLoadingNextScreen(true)
    setMnemonic('')
    try {
      const trimmed = mnemonic.trim()
      const isValid = validateMnemonic(trimmed)
      if (isValid) {
        const provider = new Filecoin(
          new walletSubproviders.HDWalletProvider(mnemonic),
          {
            apiAddress:
              'http://node.glif.io/0bf3778d-95f6-4066-9fd1-7ee9c8ff3624/rpc/v0'
          }
        )
        dispatch(createWalletProvider(provider))
        const wallet = await fetchDefaultWallet(provider)
        dispatchRdx(walletList([wallet]))
        const params = new URLSearchParams(router.query)
        router.push(`/wallet?${params.toString()}`)
      } else {
        setMnemonicError('Invalid seed phrase')
      }
    } catch (err) {
      setLoadingNextScreen(false)
      setMnemonicError(err.message || JSON.stringify(err))
    }
  }

  return (
    <>
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
              showStepper={false}
            />

            <Title mt={3}>Input, Import & Proceed</Title>
            <Text>Please input your seed phrase below to continue </Text>
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
              onClick={instantiateProvider}
              variant='primary'
              ml={2}
            />
          </Box>
        </Box>
      )}
    </>
  )
}
