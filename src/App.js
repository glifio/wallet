import React, { Fragment } from 'react'
import 'styled-components/macro'

import { useProgress, useFilecoin } from './hooks'
import DisplayWallet from './components/DisplayWallet'
import ConnectWallet from './components/ConnectWallet'
import AccessWallet from './components/AccessWallet'
import Header from './components/Header'
import Error from './components/Error'

function App() {
  const { progress } = useProgress()
  useFilecoin()
  return (
    <Fragment>
      <Error />
      <Header />
      {progress === 0 && <AccessWallet />}
      {progress === 1 && <ConnectWallet />}
      {progress === 2 && <DisplayWallet />}
    </Fragment>
  )
}

export default App
