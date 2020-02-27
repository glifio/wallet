import React from 'react'
import { string, func } from 'prop-types'
import Box from '../Box'
import Glyph from '../Glyph'
import Button from '../Button'
import { Title, Text } from '../Typography'

const AccountError = ({ errorMsg, onTryAgain }) => (
  <Box
    display='flex'
    flexDirection='column'
    justifyContent='space-between'
    width={11}
    height={11}
    borderRadius={2}
    p={3}
    bg='card.error.background'
    boxShadow={1}
    mb={2}
  >
    <Box display='flex' alignItems='center' justifyContent='flex-start'>
      <Glyph mr={3} color='card.account.color' acronym='Er' />
      <Text>Error</Text>
    </Box>
    <Box color='card.account.color'>
      <Title>Ledger Device Problem</Title>
      <Text margin={0}>{errorMsg}</Text>
    </Box>
    <Box display='flex'>
      <Button variant='tertiary' title='Try again' onClick={onTryAgain} p={2} />
    </Box>
  </Box>
)

AccountError.propTypes = {
  onTryAgain: func.isRequired,
  errorMsg: string
}

AccountError.defaultProps = {
  errorMsg: ''
}

export default AccountError
