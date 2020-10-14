import { PL_SIGNERS } from '../../constants'

/**
 * state looks like
 * {{"Balance":"0","State":{"Signers":["f020484","f023667"],"NumApprovalsThreshold":1,"NextTxnID":0,"InitialBalance":"0","StartEpoch":0,"UnlockDuration":0,"PendingTxns":{"/":"bafy2bzaceamp42wmmgr2g2ymg46euououzfyck7szknvfacqscohrvaikwfay"}}},"id":1}
 */

export const msigPartlyOwnedByPL = signers => {
  const [signer0, signer1] = signers
  return PL_SIGNERS.has(signer0) || PL_SIGNERS.has(signer1)
}

export default state => {
  // single signer
  if (state.Signers.length === 1) return true
  if (state.Signers.length === 2) {
    return msigPartlyOwnedByPL(state.Signers)
  }
  if (state.Signers.length > 2) return false
  // glif msig can't handle multisigner multisigs
  if (state.NumApprovalsThreshold > 1) return false
}
