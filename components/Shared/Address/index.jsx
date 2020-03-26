import React, { forwardRef, useState } from 'react'
import styled from 'styled-components'
import { space, color, layout, border, flexbox } from 'styled-system'
import { ADDRESS_PROPTYPE } from '../../../customPropTypes'
import Box from '../Box'
import { Text } from '../Typography'
import theme from '../theme'
import copyToClipboard from '../../../utils/copyToClipboard'

const Wrapper = styled(Box).attrs(() => ({
  border: 1,
  borderColor: 'input.border',
  borderRadius: 1,
  pl: 3,
  width: 14
}))`
  display: flex;
  height: 70px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  ${space};
`

const InlineButton = styled.button.attrs(() => ({
  border: 0,
  borderLeft: 1,
  borderColor: 'input.border',
  borderTopRightRadius: 1,
  borderBottomRightRadius: 1,
  bg: 'input.background.base',
  width: 7,
  p: 0,
  ...theme.textStyles.label
}))`
  display: inline-block;
  &:hover {
    cursor: pointer;
  }
  height: 100%;
  outline: none;
  ${color}
  ${space}
  ${layout}
  ${border}
  ${flexbox}
`

const Address = forwardRef(({ address, ...props }, ref) => {
  const [showAddress, setShowAddress] = useState(false)
  return (
    <Wrapper ref={ref} {...props}>
      {showAddress ? (
        <Text pl={1} pr={2}>
          {address}
        </Text>
      ) : (
        <Box pl={1} pr={2} display='flex' flexDirection='row'>
          <Text>{address.slice(0, 2)}</Text>
          <Text mx={1}>{Array(address.length - 10).join('●')}</Text>
          <Text>{address.slice(-4)}</Text>
        </Box>
      )}

      <Box height='100%' display='flex' flexDirection='row'>
        <InlineButton onClick={() => copyToClipboard(address)}>
          Copy
        </InlineButton>
        <InlineButton onClick={() => setShowAddress(!showAddress)}>
          {showAddress ? 'Hide' : 'Reveal'}
        </InlineButton>
      </Box>
    </Wrapper>
  )
})

Address.propTypes = {
  /**
   * filecoin address
   */
  address: ADDRESS_PROPTYPE
}

Address.defaultProps = {
  address: ''
}

export default Address
