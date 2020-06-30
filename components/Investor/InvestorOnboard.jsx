import React from 'react'
import { useSelector } from 'react-redux'
import Ledger from '../Onboarding/Configure/Ledger'
import { Box } from '../Shared'
import EnterUUID from './UUID'

export default () => {
  const { investor } = useSelector(state => ({
    investor: state.investor
  }))
  return (
    <Box
      display='flex'
      flexDirection='column'
      minHeight='100vh'
      justifyContent='center'
      alignItems='center'
      padding={[2, 3, 5]}
    >
      {investor ? <Ledger investor /> : <EnterUUID />}
    </Box>
  )
}
