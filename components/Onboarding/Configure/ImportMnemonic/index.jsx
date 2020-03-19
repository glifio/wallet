import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { validateMnemonic } from 'bip39'
import { Box, Button, Card, Title, Input, StepCard } from '../../../Shared'

import { useWalletProvider } from '../../../../WalletProvider'
import CreateHDWalletProvider from '../../../../WalletProvider/Subproviders/HDWalletProvider'

export default () => {
  const { setWalletType } = useWalletProvider()
  const [mnemonic, setMnemonic] = useState('')
  const [validMnemonic, setValidMnemonic] = useState('')
  const [mnemonicError, setMnemonicError] = useState('')
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
      setMnemonic('')
      setValidMnemonic('')
    }
  }, [router, wallets, network])
  return (
    <>
      {validMnemonic && (
        <CreateHDWalletProvider
          network={network}
          mnemonic={validMnemonic}
          ready={!!validMnemonic}
        />
      )}
      <Box display='flex' flexDirection='column' justifyContent='center'>
        <Box
          display='flex'
          flexWrap='wrap'
          flexDirection='row'
          justifyContent='center'
        >
          <StepCard
            currentStep={1}
            totalSteps={2}
            description='Please enter your seed phrase to access the accounts connected
          to your seed phrase.'
            glyphAcronym='Sp'
            m={2}
          />
          <Card
            width='auto'
            display='flex'
            flexDirection='column'
            justifyContent='space-between'
            borderColor='core.lightgray'
          >
            <Title mt={3}>Please input your 12-word seed phrase below</Title>
            <Input.Mnemonic
              error={mnemonicError}
              setError={setMnemonicError}
              value={mnemonic}
              onChange={e => setMnemonic(e.target.value)}
            />
          </Card>
        </Box>
        <Box
          mt={6}
          display='flex'
          flexDirection='row'
          justifyContent='space-around'
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
    </>
  )
}
