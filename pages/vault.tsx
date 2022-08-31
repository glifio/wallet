import { useEnvironment } from '@glif/react-components'
import { useRouter } from 'next/router'

function RedirectToSafe() {
  const router = useRouter()
  const { safeUrl } = useEnvironment()
  // Make sure we're in the browser
  if (typeof window !== 'undefined') {
    router.push(safeUrl)
  }
  return null
}

export default RedirectToSafe
