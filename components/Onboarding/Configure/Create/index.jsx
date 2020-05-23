import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import Filecoin from '@openworklabs/filecoin-wallet-provider'
import {
  Box,
  Button,
  OnboardCard,
  StepHeader,
  LoadingScreen
} from '../../../Shared'

import Walkthrough from './Walkthrough'
import Back from './Back'
import { useWasm } from '../../../../lib/WasmLoader'
import { walletList } from '../../../../store/actions'
import { useWalletProvider } from '../../../../WalletProvider'
import { createWalletProvider } from '../../../../WalletProvider/state'

export default () => {
  const router = useRouter()
  const [mnemonic, setMnemonic] = useState('')
  const [walkthroughStep, setWalkthroughStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [returningHome, setReturningHome] = useState(false)
  const [canContinue, setCanContinue] = useState(false)
  const [importSeedError, setImportSeedError] = useState(false)
  const { generateMnemonic } = useWasm()
  const {
    dispatch,
    fetchDefaultWallet,
    walletSubproviders
  } = useWalletProvider()
  const dispatchRdx = useDispatch()

  const nextStep = () => {
    setImportSeedError(false)
    if (walkthroughStep === 1) setWalkthroughStep(2)
    else if (walkthroughStep === 2 && canContinue) setWalkthroughStep(3)
    else if (walkthroughStep === 2) setImportSeedError(true)
    else if (walkthroughStep >= 3) setWalkthroughStep(walkthroughStep + 1)
  }

  useEffect(() => {
    setMnemonic(generateMnemonic())
    setLoading(false)
  }, [setMnemonic, generateMnemonic])

  useEffect(() => {
    const instantiateProvider = async () => {
      try {
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
      } catch (err) {
        setImportSeedError(err.message || JSON.stringify(err))
      }
    }
    if (walkthroughStep === 4) instantiateProvider()
  }, [
    dispatch,
    dispatchRdx,
    fetchDefaultWallet,
    mnemonic,
    router,
    walkthroughStep,
    walletSubproviders.HDWalletProvider
  ])

  return (
    <>
      {!returningHome ? (
        <>
          {loading || walkthroughStep === 4 ? (
            <LoadingScreen />
          ) : (
            <>
              <Box
                display='flex'
                flexDirection='column'
                justifyContent='center'
                alignItems='center'
              >
                <OnboardCard
                  display='flex'
                  flexDirection='row'
                  flexWrap='wrap'
                  justifyContent='center'
                  maxWidth={16}
                >
                  <StepHeader
                    currentStep={walkthroughStep}
                    totalSteps={3}
                    glyphAcronym='Sp'
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
                </OnboardCard>
                <Box
                  mt={6}
                  display='flex'
                  width='100%'
                  justifyContent='space-between'
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
