import React, { FC } from 'react'
import { bool } from 'prop-types'
import { Box } from '@glif/react-components'

import ConnectLedger from './ConnectLedger'
const Ledger: FC<{ msig: boolean }> = ({ msig }) => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      width='100%'
      maxWidth={13}
    >
      <ConnectLedger msig={msig} />
    </Box>
  )
}

Ledger.propTypes = {
  msig: bool
}

Ledger.defaultProps = {
  msig: false
}

export default Ledger
