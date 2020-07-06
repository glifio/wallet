import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useMsig } from '../../../MsigProvider'

import { Box, Card } from '../../Shared'
import { FILECOIN_NUMBER_PROP } from '../../../customPropTypes'
import makeFriendlyBalance from '../../../utils/makeFriendlyBalance'

const Balances = ({ available, total }) => {
  return (
    <Box width='100%'>
      <Card>{makeFriendlyBalance(available.toFil())}</Card>
      <Card>{makeFriendlyBalance(total.toFil())}</Card>
    </Box>
  )
}

Balances.propTypes = {
  available: FILECOIN_NUMBER_PROP,
  total: FILECOIN_NUMBER_PROP
}

export default () => {
  const msigActorAddress = useSelector(state => state.msigActorAddress)
  const { Balance, AvailableBalance } = useMsig(msigActorAddress)
  return (
    <>
      <Balances available={AvailableBalance} total={Balance} />
    </>
  )
}
