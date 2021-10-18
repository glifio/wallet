import React from 'react'
import { bool } from 'prop-types'
import { Text, StyledATag } from '../Shared'

const Help = () => (
  <>
    <Text mt={2}>
      {"Don't see an account you're looking for? "}
      <StyledATag
        fontSize={2}
        ml={2}
        href='https://reading.supply/@glif/not-seeing-the-right-address-when-accessing-the-glif-wallet-NE1FhV'
      >
        Learn More
      </StyledATag>
    </Text>
  </>
)

const HelperText = ({ msig, isLedger }) => {
  if (msig) {
    return (
      <>
        <Text>Please select a Ledger account.</Text>
        <Help />
      </>
    )
  }

  return (
    <>
      {isLedger ? (
        <Text>
          Your single Ledger device creates hundreds of individual accounts.
          We&apos;re showing you the first 5.
        </Text>
      ) : (
        <Text>
          Your single seed phrase creates hundreds of individual accounts.
          We&apos;re showing you the first 5.
        </Text>
      )}
      <Help />
    </>
  )
}

HelperText.propTypes = {
  msig: bool.isRequired,
  isLedger: bool.isRequired
}

export default HelperText
