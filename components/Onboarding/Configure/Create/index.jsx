import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { Box, Button, StepCard, Loading, Label } from '../../../Shared'

import CreateHDWalletProvider from '../../../../WalletProvider/Subproviders/HDWalletProvider'
import GenerateMnemonic from '../../../../WalletProvider/GenerateMnemonic'
import Walkthrough from './Walkthrough'
import Back from './Back'

export default () => {
  const { network, wallets } = useSelector(state => ({
    network: state.network,
    wallets: state.wallets
  }))
  const router = useRouter()
  const [mnemonic, setMnemonic] = useState('')
  const [walkthroughStep, setWalkthroughStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [returningHome, setReturningHome] = useState(false)
  const [canContinue, setCanContinue] = useState(true)
  const timeout = useRef()

  const waitForMnemonic = useCallback(
    timer => {
      clearTimeout(timeout.current)
      timeout.current = setTimeout(() => {
        if (!mnemonic) {
          waitForMnemonic(200)
        } else {
          setLoading(false)
        }
      }, timer)
    },
    [mnemonic]
  )

  useEffect(() => {
    waitForMnemonic(600)
  }, [waitForMnemonic])

  useEffect(() => {
    if (wallets.length > 0) {
      const params = new URLSearchParams(router.query)
      router.push(`/wallet?${params.toString()}`)
    }
    return () => {
      setMnemonic('')
    }
  }, [router, wallets, network])

  return (
    <>
      {!returningHome ? (
        <>
          <GenerateMnemonic setMnemonic={setMnemonic} />
          {mnemonic && (
            <CreateHDWalletProvider
              network={network}
              mnemonic={mnemonic}
              ready={walkthroughStep === 6}
            />
          )}
          {loading || walkthroughStep === 6 ? (
            <Box
              width='100%'
              display='flex'
              flexDirection='column'
              alignItems='center'
              mt={9}
            >
              <Loading width={3} height={3} />
              <Label mt={3}>Loading...</Label>
            </Box>
          ) : (
            <>
              <Box
                mt={8}
                mb={6}
                display='flex'
                flexDirection='row'
                justifyContent='center'
              >
                <StepCard
                  currentStep={walkthroughStep}
                  totalSteps={5}
                  description='Please complete the following steps to create a new wallet.'
                  glyphAcronym='Cw'
                />
                {mnemonic && (
                  <Walkthrough
                    walkthroughStep={walkthroughStep}
                    mnemonic={mnemonic}
                    setCanContinue={setCanContinue}
                  />
                )}
              </Box>
              <Box
                mt={6}
                display='flex'
                flexDirection='row'
                justifyContent='center'
              >
                <Button
                  title='Back'
                  onClick={() => setReturningHome(true)}
                  variant='secondary'
                  mr={2}
                />
                <Button
                  title={
                    walkthroughStep === 1
                      ? "I've recorded my seed phrase"
                      : 'Next'
                  }
                  disabled={!canContinue}
                  onClick={() => {
                    setCanContinue(false)
                    setWalkthroughStep(walkthroughStep + 1)
                  }}
                  variant='primary'
                  ml={2}
                />
              </Box>
            </>
          )}
        </>
      ) : (
        <Back setReturningHome={setReturningHome} />
      )}
    </>
  )
}
