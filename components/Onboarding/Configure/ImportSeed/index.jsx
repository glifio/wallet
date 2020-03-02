import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Button, Card, Text, Title, Input } from '../../../Shared'

import { useWalletProvider } from '../../../../WalletProvider'
import StepCard from './StepCard'

export default () => {
  const { setLedgerProvider, setWalletType } = useWalletProvider()
  const [seed, setSeed] = useState('')
  return (
    <>
      <Box
        mt={8}
        mb={6}
        display='flex'
        flexDirection='row'
        justifyContent='center'
      >
        <StepCard step={1} />
        <Card
          width='auto'
          display='flex'
          flexDirection='column'
          justifyContent='space-between'
        >
          <Text>Please input your 12-word seed phrase below</Text>
          <Input.Seed value={seed} onChange={e => setSeed(e.target.value)} />
        </Card>
      </Box>
      <Box mt={6} display='flex' flexDirection='row' justifyContent='center'>
        <Button
          title='Back'
          onClick={() => setWalletType(null)}
          variant='secondary'
          mr={2}
        />
        <Button
          title='Next'
          onClick={setLedgerProvider}
          variant='primary'
          ml={2}
        />
      </Box>
    </>
  )
}
