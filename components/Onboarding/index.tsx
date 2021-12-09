import React, { useState } from 'react'
import {
  NodeConnectingGlyph,
  Box,
  useWalletProvider
} from '@glif/react-components'
import { useRouter } from 'next/router'
import ChooseWallet from './Choose'
import ConfigureWallet from './Configure'

export default function Onboarding() {
  const { loginOption } = useWalletProvider()
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
            apiAddress={process.env.LOTUS_NODE_JSONRPC}
            onConnectionStrengthChange={(newStrength) => {
              // give a little extra time
              setTimeout(() => {
                if (newStrength === 2) setNodeConnecting(false)
                if (newStrength === 0 || newStrength === 1)
                  router.replace('/error/node-disconnected')
              }, 750)
            }}
          />
        )}
        {!nodeConnecting &&
          (loginOption ? (
            <ConfigureWallet loginOption={loginOption} />
          ) : (
            <ChooseWallet />
          ))}
      </Box>
    </>
  )
}
