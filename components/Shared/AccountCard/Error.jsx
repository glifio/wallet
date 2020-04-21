import React from 'react'
import { string, func } from 'prop-types'
import Box from '../Box'
import Glyph from '../Glyph'
import Button from '../Button'
import { Text } from '../Typography'

const AccountError = ({ errorMsg, onTryAgain, ...props }) => (
  <Box
    display='flex'
    flexDirection='column'
    justifyContent='space-between'
    width={11}
    height={11}
    borderRadius={2}
    p={3}
    bg='card.error.background'
    color='card.error.foreground'
    boxShadow={1}
    {...props}
  >
    <Box display='flex' alignItems='center' justifyContent='flex-start'>
      <Glyph mr={3} acronym='Er' color='status.fail.foreground' />
      <Text>Error</Text>
    </Box>
    <Box>
      <Text margin={0}>{errorMsg}</Text>
    </Box>
    <Box display='flex'>
      <Button
        title='Try again'
        onClick={onTryAgain}
        height='100%'
        backgroundColor='core.transparent'
        borderColor='status.fail.foreground'
        color='status.fail.foreground'
        p={2}
      />
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
