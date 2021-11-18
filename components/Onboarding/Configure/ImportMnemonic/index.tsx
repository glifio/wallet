import React, { FC, useState } from 'react'
import Filecoin from '@glif/filecoin-wallet-provider'
import { useRouter } from 'next/router'
import { validateMnemonic } from 'bip39'
import {
  Box,
  Button,
  OnboardCard,
  Title,
  Text,
  StepHeader,
  LoadingScreen,
  Input
} from '@glif/react-components'
import { useWalletProvider } from '../../../../WalletProvider'
import { createWalletProvider } from '../../../../WalletProvider/state'
import reportError from '../../../../utils/reportError'
import { navigate } from '../../../../utils/urlParams'
import { PAGE } from '../../../../constants'

const InputMnemonic: FC<{}> = () => {
  const {
    dispatch,
    fetchDefaultWallet,
    setLoginOption,
    walletSubproviders: { HDWalletProvider }
  } = useWalletProvider()
  const [mnemonic, setMnemonic] = useState('')
  const [mnemonicError, setMnemonicError] = useState('')
  const [loadingNextScreen, setLoadingNextScreen] = useState(false)
  const router = useRouter()
  const { walletList } = useWalletProvider()

  const instantiateProvider = async () => {
    setLoadingNextScreen(true)
    setMnemonic('')
    try {
      const trimmed = mnemonic.trim()
      const isValid = validateMnemonic(trimmed)
      if (isValid) {
        const provider = new Filecoin(HDWalletProvider(mnemonic), {
          apiAddress: process.env.LOTUS_NODE_JSONRPC
        })
        dispatch(createWalletProvider(provider))
        const wallet = await fetchDefaultWallet(provider)
        walletList([wallet])
        navigate(router, { pageUrl: PAGE.WALLET_HOME })
      } else {
        setMnemonicError('Invalid seed phrase')
      }
    } catch (err) {
      reportError(17, false, err.message, err.stack)
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
              onChange={(e) => setMnemonic(e.target.value)}
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
              onClick={() => setLoginOption(null)}
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

export default InputMnemonic
