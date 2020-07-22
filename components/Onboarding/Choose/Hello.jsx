import React from 'react'
import { Box, Text, BigTitle } from '../../Shared'
import NodeConnectedWidget from '../../Shared/NodeConnected'

export default ({ ...props }) => (
  <Box {...props}>
    <NodeConnectedWidget apiAddress={process.env.LOTUS_NODE_JSONRPC} />
    <BigTitle mt={3}>Glif</BigTitle>
    <Text mb={1} maxWidth={12}>
      Create or login to your wallet to access the Filecoin network.
    </Text>
  </Box>
)
