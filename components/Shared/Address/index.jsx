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
  pl: 3
}))`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: auto;
`

const InlineButton = styled.button.attrs(() => ({
  ...theme.textStyles.label,
  border: 0,
  borderLeft: 1,
  borderColor: 'input.border',
  borderTopRightRadius: 1,
  borderBottomRightRadius: 1,
  bg: 'input.background.base',
  width: 7
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
      <Text pr={3}>{address}</Text>
      <InlineButton onClick={() => copyToClipboard(address)}>Copy</InlineButton>
      <InlineButton onClick={() => setShowAddress(!showAddress)}>
        {showAddress ? 'Reveal' : 'Hide'}
      </InlineButton>
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
