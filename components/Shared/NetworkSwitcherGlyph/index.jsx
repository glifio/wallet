import React from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { bool, func } from 'prop-types'
import { border, typography, layout, flexbox, space } from 'styled-system'
import Box from '../Box'

const NetworkSwitcherButton = styled.button.attrs(() => ({
  display: 'flex',
  flexShrink: '0',
  alignItems: 'center',
  justifyContent: 'center',
  height: 6,
  paddingLeft: 2,
  padidngRight: 2,
  fontSize: 2,
  fontWeight: 1,
  fontFamily: 'RT-Alias-Medium',
  border: 0,
  borderRadius: 0
}))`
  background: ${props => {
    if (props.connected && props.active)
      return props.theme.colors.status.success.background
    if (props.error) return props.theme.colors.status.error.background
    return props.theme.colors.core.transparent
  }};
  transition: 0.2s ease-in-out;
  &:hover {
    cursor: pointer;
    background: ${props => props.active || props.theme.colors.core.lightgray};
  }
  outline: none;
  ${border}
  ${typography}
  ${layout}
  ${flexbox}
  ${space}
`

const NetworkSwitcherGlyph = ({ ...props }) => {
  const router = useRouter()
  const networkFromRedux = useSelector(state => state.network)
  const onNetworkSwitch = network => {
    if (network !== networkFromRedux) {
      const searchParams = new URLSearchParams(router.query)
      searchParams.set('network', network)
      router.replace(`${router.pathname}?${searchParams.toString()}`)
    }
  }
  return (
    <Box
      display='flex'
      maxWidth={9}
      width='100%'
      justifyContent='flex-end'
      {...props}
    >
      <NetworkSwitcherButton
        active={networkFromRedux === 't'}
        onClick={() => onNetworkSwitch('t')}
      >
        Testnet
      </NetworkSwitcherButton>
      <NetworkSwitcherButton
        active={networkFromRedux === 'f'}
        onClick={() => onNetworkSwitch('f')}
      >
        Mainnet
      </NetworkSwitcherButton>
    </Box>
  )
}

NetworkSwitcherButton.propTypes = {
  active: bool,
  connected: bool,
  onClick: func.isRequired
}

NetworkSwitcherButton.defaultProps = {
  connected: true,
  active: false
}

export default NetworkSwitcherGlyph
