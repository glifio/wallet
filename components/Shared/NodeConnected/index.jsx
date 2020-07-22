import { useEffect, useRef, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import calcConnectionStrength from './connectionStrength'
import noop from '../../../utils/noop'
import reportError from '../../../utils/reportError'
import Box from '../Box'
import { Text } from '../Typography'

const dotColor = ({ connectionStrength, theme: { colors } }) => {
  if (connectionStrength === -1) return colors.status.pending.background
  if (connectionStrength === 0) return colors.status.fail.background
  if (connectionStrength === 1) return colors.status.fail.background
  if (connectionStrength === 2) return colors.status.success.background
}

const ColoredDotAnimator = keyframes`
0% {
  transform: translateX(0px)
}

50% { 
  transform: translateX(8px)
}

100% { 
  transform: translate(0px)
}
`

const ColoredDot = styled.span`
  height: 8px;
  width: 8px;
  background-color: ${dotColor};
  border-radius: 50%;
  display: inline-block;
  margin: 4px;
  animation: ColoredDotAnimator 0.24s linear;
`

const NodeConnectedWidget = ({
  apiAddress,
  onConnectionStrengthChange,
  token
}) => {
  const [connectionStrength, setConnectionStrength] = useState(-1)
  const timeout = useRef()

  const pollConnection = useCallback(
    async (pollTimer = 10000) => {
      clearTimeout(timeout.current)
      timeout.current = setTimeout(async () => {
        try {
          const strength = await calcConnectionStrength(apiAddress, token)
          if (strength !== connectionStrength) {
            setConnectionStrength(strength)
            onConnectionStrengthChange(strength)
          }

          return pollConnection()
        } catch (err) {
          reportError('NodeConnectedWidget:1', false, err.message, err.stack)
        }
      }, pollTimer)
    },
    [apiAddress, connectionStrength, onConnectionStrengthChange, token]
  )

  useEffect(() => {
    pollConnection(0)
    return () => {
      if (timeout.current) clearTimeout(timeout.current)
    }
  }, [pollConnection])

  const nodeConnectedText = () => {
    // Connecting to node..
    if (connectionStrength === -1) return 'Connecting..'
    if (connectionStrength === 0)
      // Could not establish connection with our node
      return 'Disconnected'
    // Connected to an unhealthy node
    if (connectionStrength === 1) return 'Disconnected'
    // Node connected
    if (connectionStrength === 2) return 'Connected'
  }

  return (
    <Box
      display='inline-flex'
      justifyContent='space-between'
      alignItems='center'
      minWidth={10}
      p={2}
      border={1}
      borderColor='core.lightgray'
      borderRadius={3}
    >
      <ColoredDot connectionStrength={connectionStrength} />
      <Text display='inline' textAlign='center' m={0} ml={3}>
        {nodeConnectedText()}
      </Text>
    </Box>
  )
}

NodeConnectedWidget.propTypes = {
  apiAddress: PropTypes.string.isRequired,
  token: PropTypes.string,
  // 0 - disconnected
  // 1 - node unhealthy
  // 2 - healthy
  onConnectionStrengthChange: PropTypes.func
}

NodeConnectedWidget.defaultProps = {
  onConnectionStrengthChange: noop,
  token: ''
}

export default NodeConnectedWidget
