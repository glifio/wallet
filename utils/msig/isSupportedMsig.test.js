import isSupportedMsig from './isSupportedMsig'
import { PL_SIGNERS } from '../../constants'

const createMockMsigState = (Signers, NumApprovalsThreshold) => {
  return {
    Signers,
    NumApprovalsThreshold,
    NextTxnID: 0,
    InitialBalance: '0',
    StartEpoch: 0,
    UnlockDuration: 0,
    PendingTxns: {
      '/': 'bafy2bzaceamp42wmmgr2g2ymg46euououzfyck7szknvfacqscohrvaikwfay'
    }
  }
}

describe('isSupportedMsig', () => {
  test('it returns true if the multisig state has 1 signer', () => {
    const state = createMockMsigState(['f1234'], 1)
    expect(isSupportedMsig(state)).toBe(true)
  })

  test('it returns true if the multisig state has 2 signers, 1 of which is a PL signer', () => {
    const state = createMockMsigState(
      ['f1234', PL_SIGNERS.values().next().value],
      1
    )
    expect(isSupportedMsig(state)).toBe(true)
  })

  test('it returns false if the multisig state has 2 signers, 0 of which is a PL signer', () => {
    const state = createMockMsigState(['f1234', 'f12345'], 1)
    expect(isSupportedMsig(state)).toBe(false)
  })

  test('it returns false if the multisig state has approval threshold of more than 1', () => {
    const state = createMockMsigState(['f1234', 'f12345'], 2)
    expect(isSupportedMsig(state)).toBe(false)
  })

  test('it returns false if the multisig state has more than 2 signers', () => {
    const state = createMockMsigState(['f1234', 'f12345', 'f123456'], 2)
    expect(isSupportedMsig(state)).toBe(false)
  })
})
