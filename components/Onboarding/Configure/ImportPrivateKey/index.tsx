import React, { FC, useState } from 'react'
import Filecoin, { SECP256K1KeyProvider } from '@glif/filecoin-wallet-provider'
import { useRouter } from 'next/router'
import {
  Box,
  Button,
  OnboardCard,
  Title,
  Text,
  StepHeader,
  LoadingScreen,
  Input,
  useWalletProvider,
  createWalletProvider
} from '@glif/react-components'
import reportError from '../../../../utils/reportError'
import { navigate } from '../../../../utils/urlParams'
import { PAGE } from '../../../../constants'

const InputPrivateKey: FC<{}> = () => {
  const { dispatch, fetchDefaultWallet, setLoginOption } = useWalletProvider()
  const [privateKey, setPrivateKey] = useState('')
  const [privateKeyError, setPrivateKeyError] = useState('')
  const { walletList } = useWalletProvider()
  const [loadingNextScreen, setLoadingNextScreen] = useState(false)
  const router = useRouter()

  const instantiateProvider = async () => {
    try {
      setLoadingNextScreen(true)
      setPrivateKey('')
      const provider = new Filecoin(new SECP256K1KeyProvider(privateKey), {
        apiAddress: process.env.LOTUS_NODE_JSONRPC
      })
      dispatch(createWalletProvider(provider))
      const wallet = await fetchDefaultWallet(provider)
      walletList([wallet])
      navigate(router, { pageUrl: PAGE.WALLET_HOME })
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
                onChange={(e) => setPrivateKey(e.target.value)}
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
              onClick={() => setLoginOption(null)}
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

export default InputPrivateKey
