import React from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'

import styled from 'styled-components'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

import { switchNetwork } from '../../store/actions'
import AccountSelector from './AccountSelector'

const AccountAndNetworkPanelContainer = styled.div`
  grid-area: balance-banner;
  background: white;
  border: 0;
`

const AccountAndNetworkPanel = ({ loadingAccounts, setLoadingAccounts }) => {
  const { network } = useSelector(state => ({
    network: state.network
  }))

  const dispatch = useDispatch()

  return (
    <AccountAndNetworkPanelContainer>
      <Tabs
        id='controlled-tab-example'
        activeKey={network}
        onSelect={k => dispatch(switchNetwork(k))}
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
