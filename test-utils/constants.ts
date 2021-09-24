import converAddrToFPrefix from '../utils/convertAddrToFPrefix'

export const WALLET_ADDRESS = 't1z225tguggx4onbauimqvxzutopzdr2m4s6z6wgi'

// this is a premade multisig vesting actor
// if calibration net resets, these tests will fail
export const MULTISIG_ACTOR_ADDRESS =
  'f2m4f2dv7m35skytoqzsyrh5wqz3kxxfflxsha5za'
export const MULTISIG_SIGNER_ADDRESS = converAddrToFPrefix(WALLET_ADDRESS)
export const MULTISIG_SIGNER_ADDRESS_2 =
  'f1nq5k2mps5umtebdovlyo7y6a3ywc7u4tobtuo3a'

export const signers = [
  {
    account: MULTISIG_SIGNER_ADDRESS,
    id: 't01234'
  },
  {
    account: MULTISIG_SIGNER_ADDRESS_2,
    id: 't01235'
  }
]
