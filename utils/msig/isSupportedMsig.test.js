import isSupportedMsig from './isSupportedMsig'

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

  test('it returns true if the multisig state has >1 signers if numRequired 1', () => {
    const state = createMockMsigState(['f1234', 'f12345'], 1)
    expect(isSupportedMsig(state)).toBe(true)
  })

  test('it returns false if the multisig state has approval threshold of more than 1', () => {
    const state = createMockMsigState(['f1234', 'f12345'], 2)
    expect(isSupportedMsig(state)).toBe(false)
  })
})
