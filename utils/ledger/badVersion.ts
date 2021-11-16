import {
  LEDGER_VERSION_MAJOR,
  LEDGER_VERSION_MINOR,
  LEDGER_VERSION_PATCH
} from '../../constants'

const badVersion = ({
  major,
  minor,
  patch
}: {
  major: number
  minor: number
  patch: number
}): boolean => {
  const aboveMajor = major > LEDGER_VERSION_MAJOR
  const aboveMinor = minor > LEDGER_VERSION_MINOR
  const abovePatch = patch > LEDGER_VERSION_PATCH

  const atMajor = major === LEDGER_VERSION_MAJOR
  const atMinor = minor === LEDGER_VERSION_MINOR
  const atPatch = patch === LEDGER_VERSION_PATCH

  const belowMajor = major < LEDGER_VERSION_MAJOR
  const belowMinor = minor < LEDGER_VERSION_MINOR
  const belowPatch = patch < LEDGER_VERSION_PATCH

  if (aboveMajor) return false
  if (belowMajor) return true

  if (atMajor) {
    if (aboveMinor) return false
    if (belowMinor) return true

    if (atMinor) {
      if (abovePatch || atPatch) return false
      if (belowPatch) return true
    }
  }

  return true
}

export default badVersion
