import React from 'react'

import useDesktopBrowser from '../lib/useDesktopBrowser'
import { Onboard } from '../components'

export default () => {
  useDesktopBrowser()
  return <Onboard />
}
