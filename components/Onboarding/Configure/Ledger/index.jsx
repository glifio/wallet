import React, { useState } from 'react'
import { bool } from 'prop-types'
import { Box } from '../../../Shared'

import Step1 from './Step1'
import Step2 from './Step2'

const Ledger = ({ premainnetInvestor, msig }) => {
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
      {step === 1 && (
        <Step1
          premainnetInvestor={premainnetInvestor}
          msig={msig}
          setStep={setStep}
        />
      )}
      {step === 2 && (
        <Step2 premainnetInvestor={premainnetInvestor} msig={msig} />
      )}
    </Box>
  )
}

Ledger.propTypes = {
  premainnetInvestor: bool,
  msig: bool
}

Ledger.defaultProps = {
  premainnetInvestor: false,
  msig: false
}

export default Ledger
