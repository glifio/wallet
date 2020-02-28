import React from 'react'
import { Box, Card, Text, Title } from '../Shared'
import AccountCardAlt from '../Shared/AccountCardAlt'
import { useWallet } from '../Wallet/hooks'

export default () => {
  const wallet = useWallet()
  return (
    <Box>
      <Box>
        <Card
          display='flex'
          flexDirection='column'
          justifyContent='space-between'
          width={11}
          height={11}
          borderRadius={2}
          p={3}
        >
          <Title>Choose an account</Title>
        </Card>
      </Box>
      <Box>
        <AccountCardAlt address={wallet.address} />
      </Box>
    </Box>
  )
}
