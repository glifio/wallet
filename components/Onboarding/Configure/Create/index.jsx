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
  const [loading, setLoading] = useState(true)
  const [returningHome, setReturningHome] = useState(false)
  const [canContinue, setCanContinue] = useState(false)
  const [importSeedError, setImportSeedError] = useState(false)
  const timeout = useRef()

  const nextStep = () => {
    setImportSeedError(false)
    if (walkthroughStep === 1) setWalkthroughStep(2)
    else if (walkthroughStep === 2 && canContinue) setWalkthroughStep(3)
    else if (walkthroughStep === 2) setImportSeedError(true)
    else if (walkthroughStep >= 3) setWalkthroughStep(walkthroughStep + 1)
  }

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

  useEffect(() => waitForMnemonic(600), [waitForMnemonic])

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
              ready={walkthroughStep === 4}
            />
          )}
          {loading || walkthroughStep === 4 ? (
            <Box
              display='flex'
              flexDirection='column'
              alignItems='center'
              justifyContent='center'
            >
              <Loading width={3} height={3} />
              <Label mt={3}>Loading...</Label>
            </Box>
          ) : (
            <>
              <Box
                display='flex'
                flexDirection='column'
                justifyContent='center'
                alignItems='center'
              >
                <Box
                  display='flex'
                  flexDirection='row'
                  flexWrap='wrap'
                  justifyContent='center'
                >
                  <StepCard
                    currentStep={walkthroughStep}
                    totalSteps={4}
                    description='Please complete the following steps to create a new wallet.'
                    glyphAcronym='Cw'
                  />
                  {mnemonic && (
                    <Walkthrough
                      importSeedError={importSeedError}
                      canContinue={canContinue}
                      walkthroughStep={walkthroughStep}
                      mnemonic={mnemonic}
                      setCanContinue={setCanContinue}
                    />
                  )}
                </Box>
                <Box
                  maxWidth={16}
                  mt={6}
                  display='flex'
                  flexDirection='row'
                  justifyContent='center'
                >
                  <Button
                    title='Back'
                    onClick={() => {
                      if (walkthroughStep === 2) setWalkthroughStep(1)
                      else setReturningHome(true)
                    }}
                    variant='secondary'
                    mr={2}
                  />
                  <Button
                    title={
                      walkthroughStep === 1
                        ? "I've recorded my seed phrase"
                        : 'Next'
                    }
                    onClick={nextStep}
                    variant='primary'
                    ml={2}
                  />
                </Box>
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
