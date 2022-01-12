import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { isMobileOrTablet } from '@glif/react-components'

export default function useDesktopBrowser() {
  const { replace } = useRouter()
  useEffect(() => {
    const onMobileBrowser = isMobileOrTablet()
    if (onMobileBrowser) replace('/error/use-desktop-browser')
  })
}
