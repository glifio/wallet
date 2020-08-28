import { useEffect, useRef, useState, useCallback, forwardRef } from 'react'
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
  animation: ${ColoredDotAnimator} 0.24s linear;
`

const NodeConnectedWidget = forwardRef(
  (
    { apiAddress, onConnectionStrengthChange, token, mockStrength, ...props },
    ref
  ) => {
    const [connectionStrength, setConnectionStrength] = useState(-1)
    const [polling, setPolling] = useState(false)
    const timeout = useRef()

    const pollConnection = useCallback(
      async (pollTimer = 100000) => {
        clearTimeout(timeout.current)
        timeout.current = setTimeout(async () => {
          try {
            const strength =
              mockStrength === -1
                ? await calcConnectionStrength(apiAddress, token)
                : mockStrength
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
      [
        apiAddress,
        connectionStrength,
        onConnectionStrengthChange,
        token,
        mockStrength
      ]
    )

    useEffect(() => {
      if (mockStrength > -1) {
        setConnectionStrength(mockStrength)
        onConnectionStrengthChange(mockStrength)
      } else if (!polling && mockStrength === -1) pollConnection(0)
      setPolling(true)
    }, [
      mockStrength,
      polling,
      setPolling,
      pollConnection,
      setConnectionStrength,
      onConnectionStrengthChange
    ])

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
        justifyContent='space-around'
        alignItems='center'
        minWidth={9}
        width={9}
        height={6}
        p={2}
        border={1}
        borderColor='core.lightgray'
        borderRadius={3}
        {...props}
        ref={ref}
      >
        <ColoredDot connectionStrength={connectionStrength} />
        <Text display='inline' textAlign='center' m={0}>
          {nodeConnectedText()}
        </Text>
      </Box>
    )
  }
)

NodeConnectedWidget.propTypes = {
  apiAddress: PropTypes.string.isRequired,
  token: PropTypes.string,
  // 0 - disconnected
  // 1 - node unhealthy
  // 2 - healthy
  onConnectionStrengthChange: PropTypes.func,
  mockStrength: PropTypes.oneOf([-1, 0, 1, 2])
}

NodeConnectedWidget.defaultProps = {
  onConnectionStrengthChange: noop,
  token: '',
  mockStrength: -1
}

export default NodeConnectedWidget
