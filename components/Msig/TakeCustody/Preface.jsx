import React from 'react'

import Warning from '../../Shared/Warning'
import { Box } from '../../Shared'

const Preface = () => {
  return (
    <Box>
      <Warning
        title='Warning'
        description={[
          'Right now, Protocol Labs owns an account that is a signer on your Multisig actor.',
          "You're about to remove Protocol Labs from your Multisig actor, effectively taking full control.",
          'This action is irreversible.'
        ]}
      />
    </Box>
  )
}

export default Preface
