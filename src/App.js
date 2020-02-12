import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import 'styled-components/macro'

import { useProgress, useFilecoin, useCachedMessages } from './hooks'
import DisplayWallet from './components/DisplayWallet'
import ConnectWallet from './components/ConnectWallet'
import Header from './components/Header'
import Error from './components/Error'
import BadBrowser from './components/Error/BadBrowser'
import Settings from './components/Settings'
import Contact from './components/Contact'
import Faqs from './components/Faqs'
import HowTo from './components/HowTo'
import BrowserChecker from './services/BrowserChecker'
import { NetworkChecker } from './services'

function App() {
  useCachedMessages()
  const { progress } = useProgress()
  useFilecoin()
  return (
    <Router>
      <BrowserChecker />
      <NetworkChecker />
      <Error />
      <Header />
      <Switch>
        <Route path='/error/bad-browser'>
          <BadBrowser />
        </Route>
        <Route path='/faqs'>
          <Faqs />
        </Route>
        <Route path='/how-to'>
          <HowTo />
        </Route>
        <Route path='/contact-us'>
          <Contact />
        </Route>
        <Route path='/settings'>
          <>
            {progress === 1 && <ConnectWallet />}
            {progress === 2 && <Settings />}
          </>
        </Route>
        <Route>
          <>
            {progress === 1 && <ConnectWallet />}
            {progress === 2 && <DisplayWallet />}
          </>
        </Route>
      </Switch>
    </Router>
  )
}

export default App
