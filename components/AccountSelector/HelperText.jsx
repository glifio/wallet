import React from 'react'
import { bool } from 'prop-types'
import { Text, StyledATag } from '../Shared'

const LedgerHelp = () => (
  <>
    <Text color='core.primary' mt={5} mb={0} fontSize={2}>
      Don&apos;t see an address you&apos;re looking for?
    </Text>
    <Text mt={2}>
      Your Ledger Device generates different addresses depending on whether
      it&apos;s connected to the Filecoin testnet or mainnet.
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

const SeedHelp = () => (
  <>
    <Text color='core.primary' fontSize={2}>
      Don&apos;t see an address you&apos;re looking for?
    </Text>
    <Text>
      Your seed phrase generates different addresses depending on whether
      it&apos;s connected to the Filecoin testnet or mainnet.
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
        <LedgerHelp />
      </>
    )
  }

  return (
    <>
      {isLedger ? (
        <>
          <Text>
            Your single Ledger device creates hundreds of individual accounts.
            We&apos;re showing you the first 5.
          </Text>
          <LedgerHelp />
        </>
      ) : (
        <>
          <Text>
            Your single seed phrase creates hundreds of individual accounts.
            We&apos;re showing you the first 5.
          </Text>
          <SeedHelp />
        </>
      )}
    </>
  )
}

HelperText.propTypes = {
  msig: bool.isRequired,
  isLedger: bool.isRequired
}

export default HelperText
