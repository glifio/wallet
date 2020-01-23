import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useLocation, useHistory } from 'react-router-dom'

import styled from 'styled-components'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import AccountSelector from './AccountSelector'
import { WHITE } from '../StyledComponents'

const AccountAndNetworkPanelContainer = styled.div`
  grid-area: balance-banner;
  background: ${WHITE};
  border: 0;
`

const AccountAndNetworkPanel = ({ loadingAccounts, setLoadingAccounts }) => {
  const { network } = useSelector(state => ({
    network: state.network
  }))

  const { search, pathname } = useLocation()
  const history = useHistory()

  const switchNetwork = network => {
    const params = new URLSearchParams(search)
    params.delete('network')
    params.set('network', network)
    history.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <AccountAndNetworkPanelContainer>
      <Tabs
        id='controlled-tab-example'
        activeKey={network}
        onSelect={switchNetwork}
      >
        <Tab eventKey='f' title='Mainnet'>
          <AccountSelector
            loadingAccounts={loadingAccounts}
            setLoadingAccounts={setLoadingAccounts}
            network='f'
            tabOpen={network === 'f'}
          />
        </Tab>
        <Tab eventKey='t' title='Testnet'>
          <AccountSelector
            loadingAccounts={loadingAccounts}
            setLoadingAccounts={setLoadingAccounts}
            network='t'
            tabOpen={network === 't'}
          />
        </Tab>
      </Tabs>
    </AccountAndNetworkPanelContainer>
  )
}

AccountAndNetworkPanel.propTypes = {
  loadingAccounts: PropTypes.bool.isRequired,
  setLoadingAccounts: PropTypes.func.isRequired
}

export default AccountAndNetworkPanel
