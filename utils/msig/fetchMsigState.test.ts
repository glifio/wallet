import converAddrToFPrefix from '../convertAddrToFPrefix'
import fetchMsigState from './fetchMsigState'

import {
  MULTISIG_ACTOR_ADDRESS,
  MULTISIG_SIGNER_ADDRESS,
  MULTISIG_SIGNER_ADDRESS_2
} from '../../test-utils'

describe('fetchMsigState', () => {
  test('it returns an notMsigActor error if the actor is not a multisig', async () => {
    const { errors } = await fetchMsigState('f01', MULTISIG_SIGNER_ADDRESS)

    expect(errors.notMsigActor).toBe(true)

    const { errors: errors2 } = await fetchMsigState(
      't01441',
      MULTISIG_SIGNER_ADDRESS
    )

    expect(errors2.notMsigActor).toBe(true)
  }, 10000)

  test('it returns a connected wallet not signer error if the wallet isnt a signer on the multisig', async () => {
    const { errors } = await fetchMsigState(
      't26gmvesj3ercqmprmgvkcwxkaqir2crdosmbtpny',
      MULTISIG_SIGNER_ADDRESS
    )

    expect(errors.connectedWalletNotMsigSigner).toBe(true)
  }, 10000)

  test('it returns an actor not found error if the actor isnt found', async () => {
    const { errors } = await fetchMsigState(
      't012914328591053',
      MULTISIG_SIGNER_ADDRESS
    )

    expect(errors.actorNotFound).toBe(true)
  }, 10000)

  test('it returns the full multisig actor', async () => {
    const {
      Address,
      Balance,
      AvailableBalance,
      Signers,
      ActorCode,
      InitialBalance,
      NextTxnID,
      NumApprovalsThreshold,
      StartEpoch,
      UnlockDuration
    } = await fetchMsigState(MULTISIG_ACTOR_ADDRESS, MULTISIG_SIGNER_ADDRESS_2)

    expect(Address).toBe(converAddrToFPrefix(MULTISIG_ACTOR_ADDRESS))
    expect(Balance.isGreaterThan(0)).toBe(true)
    expect(AvailableBalance.isGreaterThan(0)).toBe(true)
    expect(Signers.length).toBeGreaterThan(0)
    expect(converAddrToFPrefix(Signers[0].account)).toBe(
      MULTISIG_SIGNER_ADDRESS_2
    )
    expect(ActorCode.includes('multisig')).toBe(true)
    expect(InitialBalance.isGreaterThan(0)).toBe(true)
    expect(NumApprovalsThreshold).toBeGreaterThan(0)
    expect(StartEpoch).toBeGreaterThan(0)
    expect(UnlockDuration).not.toBeUndefined()
    expect(NextTxnID).not.toBeUndefined()
  }, 10000)
})
