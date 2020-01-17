import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import styled from 'styled-components'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

import { MessageCreator } from '../StyledComponents'
import { switchNetwork } from '../../store/actions'

const AccountAndNetworkPanel = styled.div`
  grid-area: balance-banner;
  background: white;
  border: 0;
`

export default () => {
  const { network, walletProvider, walletType } = useSelector(state => ({
    network: state.network,
    walletProvider: state.walletProvider,
    walletType: state.walletType
  }))

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
            <div>yo</div>
          </Tab>
          <Tab eventKey='t' title='Testnet'>
            <div>yo</div>
          </Tab>
        </Tabs>
      </AccountAndNetworkPanel>
      <MessageCreator>
        <div>yo</div>
      </MessageCreator>
    </>
  )
}
