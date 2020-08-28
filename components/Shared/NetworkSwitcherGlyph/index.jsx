import React from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { bool, func } from 'prop-types'
import { border, typography, layout, flexbox, space } from 'styled-system'
import Box from '../Box'
import { TESTNET, MAINNET } from '../../../constants'
import { error } from '../../../store/actions'

const NetworkSwitcherButton = styled.button.attrs(() => ({
  display: 'flex',
  flexShrink: '0',
  alignItems: 'center',
  justifyContent: 'center',
  paddingLeft: 4,
  paddingRight: 4,
  paddingTop: 1,
  paddingBottom: 1,
  fontSize: 2,
  fontWeight: 1,
  fontFamily: 'RT-Alias-Grotesk',
  border: 0,
  borderRadius: 4
}))`
  background: ${props => {
    if (props.disabled) return props.theme.colors.status.inactive
    if (props.connected && props.active)
      return props.theme.colors.status.success.background
    if (props.error) return props.theme.colors.status.error.background
    return props.theme.colors.core.transparent
  }};
  transition: 0.2s ease-in-out;

  &:first-child {
    margin-right: ${props => props.theme.sizes[2]}px;
  }

  &:hover {
    ${props => !props.disabled && 'cursor: pointer;'}
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
  const dispatch = useDispatch()
  const onNetworkSwitch = network => {
    if (network !== networkFromRedux) {
      const searchParams = new URLSearchParams(router.query)
      searchParams.set('network', network)
      router.replace(`${router.pathname}?${searchParams.toString()}`)
      dispatch(error(''))
    }
  }
  return (
    <Box
      display='flex'
      width='100%'
      justifyContent='flex-start'
      p={2}
      {...props}
    >
      <NetworkSwitcherButton
        active={networkFromRedux === TESTNET}
        onClick={() => onNetworkSwitch(TESTNET)}
      >
        Testnet
      </NetworkSwitcherButton>
      <NetworkSwitcherButton
        active={networkFromRedux === MAINNET}
        onClick={() => onNetworkSwitch(MAINNET)}
        disabled
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
