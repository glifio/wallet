import React from 'react'

import Warning from '../../Shared/Warning'
import { Box } from '../../Shared'

const Preface = () => {
  return (
    <Box>
      <Warning
        title='Warning'
        description={[
          "You're changing the ownership of your multisig account to a new Filecoin address.",
          'Make sure you own the private key to this new Filecoin address.',
          'If you do not own the private key, you will lose access to your funds permanently. There is no way to resolve this.'
        ]}
        linkDisplay="Why isn't it secure?"
        linkhref='https://coinsutra.com/security-risks-bitcoin-wallets/'
      />
    </Box>
  )
}

export default Preface
