import React, { useState } from 'react'
import { useRouter } from 'next/router'
import ChooseWallet from './Choose'
import ConfigureWallet from './Configure'
import { Box, NodeConnectingGlyph } from '../Shared'
import useWallet from '../../WalletProvider/useWallet'

export default () => {
  const wallet = useWallet()
  const router = useRouter()
  const [nodeConnecting, setNodeConnecting] = useState(true)
  return (
    <>
      <Box
        display='flex'
        minHeight='100vh'
        justifyContent='center'
        alignContent='center'
        padding={[2, 3, 5]}
      >
        {nodeConnecting && (
          <NodeConnectingGlyph
            mockStrength={process.env.IS_PROD ? -1 : 2}
            apiAddress={process.env.LOTUS_NODE_JSONRPC}
            onConnectionStrengthChange={newStrength => {
              // give a little extra time
              setTimeout(() => {
                if (newStrength === 2) setNodeConnecting(false)
                if (newStrength === 0 || newStrength === 1)
                  router.replace('/error/wallet-down')
              }, 750)
            }}
          />
        )}
        {!nodeConnecting &&
          (wallet.type ? (
            <ConfigureWallet walletType={wallet.type} />
          ) : (
            <ChooseWallet />
          ))}
      </Box>
    </>
  )
}
