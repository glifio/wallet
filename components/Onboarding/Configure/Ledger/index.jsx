import React, { useState } from 'react'
import { bool } from 'prop-types'
import { Box } from '../../../Shared'

import Step1 from './Step1'
import Step2 from './Step2'

const Ledger = ({ investor }) => {
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
      {step === 1 && <Step1 investor={investor} setStep={setStep} />}
      {step === 2 && <Step2 investor={investor} />}
    </Box>
  )
}

Ledger.propTypes = {
  investor: bool
}

Ledger.defaultProps = {
  investor: false
}

export default Ledger
