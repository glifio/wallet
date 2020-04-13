import { useEffect } from 'react'
import { useRouter } from 'next/router'

import isMobileOrTableBrowser from '../utils/isMobileOrTablet'

export default () => {
  const { replace } = useRouter()
  useEffect(() => {
    const onMobileBrowser = isMobileOrTableBrowser()
    if (onMobileBrowser) replace('/error/use-desktop-browser')
  }, [replace])
}
