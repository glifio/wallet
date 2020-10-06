import React from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { bool, func } from 'prop-types'
import { border, typography, layout, flexbox, space } from 'styled-system'
import Box from '../Box'
import { TESTNET, MAINNET } from '../../../constants'
import { error, switchNetwork } from '../../../store/actions'

const NetworkSwitcherButton = styled.button.attrs(() => ({
  display: 'flex',
  flexShrink: '0',
  alignItems: 'center',
  justifyContent: 'center',
  width: '50%',
  height: 7,
  paddingLeft: 4,
  paddingRight: 4,
  paddingTop: 1,
  paddingBottom: 1,
  fontSize: 2,
  fontWeight: 1,
  fontFamily: 'RT-Alias-Grotesk',
  border: 0
}))`
  background: ${props => {
    if (props.disabled) return props.theme.colors.status.inactive
    if (props.connected && props.active)
      return props.theme.colors.status.success.background
    if (props.error) return props.theme.colors.status.error.background
    return props.theme.colors.background.text
  }};
  
  transition: 0.2s ease-in-out;


  &:hover {
    ${props => !props.disabled && 'transform:translateY(-4px);'}
    ${props => !props.disabled && 'cursor: pointer;'}
    ${props =>
      !props.disabled &&
      'background: props.theme.colors.input.background.valid'}
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
      dispatch(switchNetwork(network))
      dispatch(error(''))
    }
  }
  return (
    <Box
      display='flex'
      width='100%'
      justifyContent='flex-start'
      mt={4}
      maxWidth='300px'
      {...props}
    >
      <NetworkSwitcherButton
        active={networkFromRedux === TESTNET}
        onClick={() => onNetworkSwitch(TESTNET)}
        borderTopLeftRadius={2}
        borderBottomLeftRadius={2}
      >
        Use t addresses
      </NetworkSwitcherButton>
      <NetworkSwitcherButton
        active={networkFromRedux === MAINNET}
        onClick={() => onNetworkSwitch(MAINNET)}
        borderTopRightRadius={2}
        borderBottomRightRadius={2}
      >
        Use f addresses
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
