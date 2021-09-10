import React from 'react'

import useDesktopBrowser from '../lib/useDesktopBrowser'
import { Onboard } from '../components'

const Index = () => {
  useDesktopBrowser()
  return <Onboard />
};

export default Index;
