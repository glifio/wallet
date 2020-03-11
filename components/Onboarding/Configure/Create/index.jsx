import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { Box, Button, StepCard } from '../../../Shared'

import { useWalletProvider } from '../../../../WalletProvider'
import CreateProvider from '../../../../WalletProvider/CreateProvider'
import GenerateMnemonic from '../../../../WalletProvider/GenerateMnemonic'
import Walkthrough from './Walkthrough'

export default () => {
  const { setWalletType } = useWalletProvider()
  const { network, wallets } = useSelector(state => ({
    network: state.network,
    wallets: state.wallets
  }))
  const router = useRouter()
  const [mnemonic, setMnemonic] = useState('')
  const [walkthroughStep, setWalkthroughStep] = useState(1)

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
      <GenerateMnemonic setMnemonic={setMnemonic} />
      <CreateProvider
        network={network}
        mnemonic={mnemonic}
        ready={walkthroughStep === 6}
      />
      <Box
        mt={8}
        mb={6}
        display='flex'
        flexDirection='row'
        justifyContent='center'
      >
        <StepCard
          currentStep={walkthroughStep}
          totalSteps={2}
          description='Please complete the following steps to create a new wallet.'
          glyphAcronym='Cw'
        />
        {mnemonic ? (
          walkthroughStep < 6 ? (
            <Walkthrough
              walkthroughStep={walkthroughStep}
              setWalkthroughStep={setWalkthroughStep}
              mnemonic={mnemonic}
            />
          ) : (
            <div>Finished</div>
          )
        ) : (
          <div>Loading</div>
        )}
      </Box>
      <Box mt={6} display='flex' flexDirection='row' justifyContent='center'>
        <Button
          title='Back'
          onClick={() => setWalletType(null)}
          variant='secondary'
          mr={2}
        />
        <Button
          title="I've recorded my seed phrase"
          disabled={false}
          onClick={() => setWalkthroughStep(walkthroughStep + 1)}
          variant='primary'
          ml={2}
        />
      </Box>
    </>
  )
}
