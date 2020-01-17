import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import styled from 'styled-components'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

import { MessageCreator } from '../StyledComponents'
import { switchNetwork } from '../../store/actions'
import AccountSelector from './AccountSelector'

const AccountAndNetworkPanel = styled.div`
  grid-area: balance-banner;
  background: white;
  border: 0;
`

export default () => {
  const { network } = useSelector(state => ({
    network: state.network
  }))

  const [loadingAccounts, setLoadingAccounts] = useState(false)

  const dispatch = useDispatch()

  return (
    <>
      <AccountAndNetworkPanel>
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
      </AccountAndNetworkPanel>
      <MessageCreator></MessageCreator>
    </>
  )
}
