import { useEffect } from 'react'
import { useRouter } from 'next/router'

import isMobileBrowser from '../utils/isMobileBrowser'

export default () => {
  const { replace } = useRouter()
  useEffect(() => {
    const onMobileBrowser = isMobileBrowser()
    if (onMobileBrowser) replace('/error/use-desktop-browser')
  }, [replace])
}
