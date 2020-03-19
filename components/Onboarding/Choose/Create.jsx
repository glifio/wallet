import React from 'react'
import PropTypes from 'prop-types'
import { Box, Card, Glyph, Text } from '../../Shared'

const CreateWallet = ({ onClick, ...props }) => (
  <Card
    css={`
      cursor: pointer;
      transition: 0.13s ease-in-out;
      &:hover {
        transform: scale(1.05);
      }
    `}
    role='button'
    onClick={onClick}
    display='flex'
    flexDirection='column'
    justifyContent='space-between'
    alignContent='space-between'
    f
    height={240}
    {...props}
  >
    <Box>
      <Box display='flex' alignItems='center'>
        <Glyph acronym='Sp' />
        <Text ml={3}>Seed Phrase</Text>
      </Box>
      <Box display='block'>
        <Text m={0} color='core.nearblack'>
          New to crypto? We'll create a new seed phrase for you
        </Text>
      </Box>
    </Box>
    <Box
      display='inline-block'
      width='max-content'
      py={2}
      px={4}
      borderRadius={6}
      fontSize={3}
      my={2}
      backgroundColor='status.warning.background'
      color='status.warning.foreground'
    >
      Quick Start
    </Box>
  </Card>
)

CreateWallet.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default CreateWallet
