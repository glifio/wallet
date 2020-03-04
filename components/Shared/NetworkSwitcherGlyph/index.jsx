import React from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { bool, func } from 'prop-types'
import Box from '../Box'

const NetworkSwitcherButton = styled.button.attrs(props => ({
  display: 'inline-block',
  height: props.height || 7,
  width: props.width || 7
}))`
  background: ${props => {
    if (props.connected && props.active)
      return props.theme.colors.status.success.background
    if (props.error) return props.theme.colors.status.error.background
    return props.theme.colors.core.transparent
  }};
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
    <Box display='flex' {...props}>
      <NetworkSwitcherButton
        active={networkFromRedux === 't'}
        onClick={() => onNetworkSwitch('t')}
      >
        Tn
      </NetworkSwitcherButton>
      <NetworkSwitcherButton
        active={networkFromRedux === 'f'}
        onClick={() => onNetworkSwitch('f')}
      >
        Mn
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
