import {
  LEDGER_VERSION_MAJOR,
  LEDGER_VERSION_MINOR,
  LEDGER_VERSION_PATCH
} from '../../constants'

export default ({ major, minor, patch }) => {
  const validMajor = major >= LEDGER_VERSION_MAJOR
  const validMinor = minor >= LEDGER_VERSION_MINOR
  const validPatch = patch >= LEDGER_VERSION_PATCH
  return !(validMajor && validMinor && validPatch)
}
