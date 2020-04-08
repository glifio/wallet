import { useEffect } from 'react'
import { useRouter } from 'next/router'

import isMobileBrowser from '../utils/isMobileBrowser'

export default () => {
  const router = useRouter()
  useEffect(() => {
    const onMobileBrowser = isMobileBrowser()
    if (onMobileBrowser) router.replace('/error/mobile-browser')
  }, [router])
}
