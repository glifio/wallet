import { useRouter } from 'next/router'

function RedirectToSafe() {
  const router = useRouter()
  // Make sure we're in the browser
  if (typeof window !== 'undefined') {
    router.push(process.env.NEXT_PUBLIC_SAFE_URL)
  }
  return null
}

export default RedirectToSafe
