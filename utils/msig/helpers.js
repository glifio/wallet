import { PL_SIGNERS } from '../../constants'

export const msigPartlyOwnedByPL = (signers) => {
  const [signer0, signer1] = signers
  return PL_SIGNERS.has(signer0) || PL_SIGNERS.has(signer1)
}

export const pickPLSigner = (signers) => {
  return signers.filter((s) => PL_SIGNERS.has(s))[0]
}
