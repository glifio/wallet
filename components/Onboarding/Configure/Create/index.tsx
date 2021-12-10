import React, { FC, useEffect, useState } from 'react'
import { number } from 'prop-types'
import { useRouter } from 'next/router'
import Filecoin, { HDWalletProvider } from '@glif/filecoin-wallet-provider'
import {
  Box,
  Button,
  OnboardCard,
  StepHeader,
  LoadingScreen
} from '@glif/react-components'
import {
  useWalletProvider,
  createWalletProvider
} from '@glif/wallet-provider-react'

import Walkthrough from './Walkthrough'
import Back from './Back'
import { useWasm } from '../../../../lib/WasmLoader'
import reportError from '../../../../utils/reportError'
import { navigate } from '../../../../utils/urlParams'
import { PAGE } from '../../../../constants'

// we pass this optional prop to make testing the core wallet functionality easier
const Create: FC<{ initialWalkthroughStep: number }> = ({
  initialWalkthroughStep
}) => {
  const router = useRouter()
  const [mnemonic, setMnemonic] = useState('')
  const [walkthroughStep, setWalkthroughStep] = useState(initialWalkthroughStep)
  const [loading, setLoading] = useState(true)
  const [returningHome, setReturningHome] = useState(false)
  const [canContinue, setCanContinue] = useState(false)
  const [importSeedError, setImportSeedError] = useState(false)
  // @ts-ignore
  const { generateMnemonic } = useWasm()
  const { dispatch, fetchDefaultWallet, walletList } = useWalletProvider()

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
        const provider = new Filecoin(new HDWalletProvider(mnemonic), {
          apiAddress: process.env.LOTUS_NODE_JSONRPC
        })
        dispatch(createWalletProvider(provider))
        const wallet = await fetchDefaultWallet(provider)
        walletList([wallet])
        navigate(router, { pageUrl: PAGE.WALLET_HOME })
      } catch (err) {
        reportError(16, false, err.message, err.stack)
        setImportSeedError(err.message || JSON.stringify(err))
      }
    }
    if (walkthroughStep === 4 && !loading) {
      setLoading(true)
      instantiateProvider()
    }
  }, [
    dispatch,
    fetchDefaultWallet,
    mnemonic,
    router,
    walkthroughStep,
    loading,
    walletList
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

Create.propTypes = {
  initialWalkthroughStep: number
}

Create.defaultProps = {
  initialWalkthroughStep: 1
}

export default Create
