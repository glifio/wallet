import { useEffect, useRef, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import calcConnectionStrength from './connectionStrength'
import noop from '../../../utils/noop'
import reportError from '../../../utils/reportError'
import Box from '../Box'
import { Text } from '../Typography'

const dotColor = connectionStrength => {
  if (connectionStrength === -1) return 'Yellow'
  if (connectionStrength === 0) return 'Red'
  if (connectionStrength === 1) return 'Orange'
  if (connectionStrength === 2) return 'Green'
}

const ColoredDot = styled.span`
  height: 8px;
  width: 8px;
  background-color: ${props => dotColor(props.connectionStrength)};
  border-radius: 50%;
  display: inline-block;
  margin: 4px;
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
    if (connectionStrength === -1) return 'Connecting to node...'
    if (connectionStrength === 0)
      return 'Could not establish connection with our node.'
    if (connectionStrength === 1) return 'Connected to an unhealthy node.'
    if (connectionStrength === 2) return 'Node connected.'
  }

  return (
    <Box display='flex' flexDirection='row' alignItems='center' height='24px'>
      <ColoredDot connectionStrength={connectionStrength} />
      <Text m={0} ml={3}>
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
