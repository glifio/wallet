import React, { useState } from 'react'
import Filecoin from '@openworklabs/filecoin-wallet-provider'
import { useDispatch } from 'react-redux'
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
import { walletList } from '../../../../store/actions'
import { useWalletProvider } from '../../../../WalletProvider'
import { createWalletProvider } from '../../../../WalletProvider/state'
import reportError from '../../../../utils/reportError'

export default () => {
  const {
    dispatch,
    fetchDefaultWallet,
    setWalletType,
    walletSubproviders: { SingleKeyProvider }
  } = useWalletProvider()
  const [privateKey, setPrivateKey] = useState('')
  const [privateKeyError, setPrivateKeyError] = useState('')
  const dispatchRdx = useDispatch()
  const [loadingNextScreen, setLoadingNextScreen] = useState(false)
  const router = useRouter()

  const instantiateProvider = async () => {
    try {
      setLoadingNextScreen(true)
      setPrivateKey('')
      const provider = new Filecoin(SingleKeyProvider(privateKey), {
        apiAddress: process.env.LOTUS_NODE_JSONRPC
      })
      dispatch(createWalletProvider(provider))
      const wallet = await fetchDefaultWallet(provider)
      dispatchRdx(walletList([wallet]))
      const params = new URLSearchParams(router.query)
      router.push(`/home?${params.toString()}`)
    } catch (err) {
      reportError(18, false, err.message, err.stack)
      setLoadingNextScreen(false)
      setPrivateKeyError(err.message || JSON.stringify(err))
    }
  }

  return (
    <>
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
              showStepper={false}
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
