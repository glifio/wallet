import React from 'react'
import PropTypes from 'prop-types'
import { Box, Card, Glyph, Text } from '../../Shared'

const CreateWallet = ({ onClick, ...props }) => (
  <Card
    css={`
      cursor: pointer;
    `}
    role='button'
    onClick={onClick}
    display='flex'
    flexDirection='column'
    justifyContent='space-between'
    height={250}
    {...props}
  >
    <Box display='flex' alignItems='center'>
      <Glyph acronym='Cw' />
      <Text ml={3}>Create Wallet</Text>
    </Box>
    <Box display='block'>
      <Text mb={0} color='core.nearblack'>
        Create a brand new wallet
      </Text>
    </Box>
  </Card>
)

CreateWallet.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default CreateWallet
