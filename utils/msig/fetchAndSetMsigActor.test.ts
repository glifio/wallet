import converAddrToFPrefix from '../convertAddrToFPrefix'
import fetchAndSetMsigActor from './fetchAndSetMsigActor'
// this is a premade multisig vesting actor
// if calibration net resets, these tests will fail
const MULTISIG_ACTOR_ADDRESS = 'f2m4f2dv7m35skytoqzsyrh5wqz3kxxfflxsha5za'
// const MULTISIG_SIGNER_ADDRESS = 'f1nq5k2mps5umtebdovlyo7y6a3ywc7u4tobtuo3a'

describe('fetchMsigState', () => {
  test('it calls the success callback with the new multisig address (passing an exec message CID)', async () => {
    const successSpy = jest.fn()
    const errorSpy = jest.fn()
    await fetchAndSetMsigActor(
      'bafy2bzacebhfwafs6qslx7xehmgqjtqvmchzj4k54q4qdcwgroloutqbh6v6e',
      successSpy,
      errorSpy
    )

    expect(converAddrToFPrefix(successSpy.mock.calls[0][0])).toBe(
      MULTISIG_ACTOR_ADDRESS
    )
  })

  test('it calls the error callback when there is an error', async () => {
    const successSpy = jest.fn()
    const errorSpy = jest.fn()
    await fetchAndSetMsigActor(
      'bafy2bzacebo6out5pl3b5c2xdaxt3fgmu3gjfifwohzca3d53x4tm74fsnnpu',
      successSpy,
      errorSpy
    )

    expect(errorSpy).toHaveBeenCalled()
  })
})
