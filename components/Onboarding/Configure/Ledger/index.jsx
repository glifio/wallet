import React, { useState } from 'react'
import { bool } from 'prop-types'
import { Box } from '../../../Shared'

import Step1 from './Step1'
import Step2 from './Step2'

const Ledger = ({ msig }) => {
  const [step, setStep] = useState(1)
  return (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      width='100%'
      maxWidth={13}
    >
      {step === 1 && <Step1 msig={msig} setStep={setStep} />}
      {step === 2 && <Step2 msig={msig} />}
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
