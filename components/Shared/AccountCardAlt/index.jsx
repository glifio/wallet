import React from 'react'
import { string, number, bool, func } from 'prop-types'
import { ADDRESS_PROPTYPE } from '../../../customPropTypes'
import Box from '../Box'
import Glyph from '../Glyph'
import Card from '../Card'
import { Text, Title } from '../Typography'
import truncate from '../../../utils/truncateAddress'

const AccountCardAlt = ({
  address,
  index,
  balance,
  selected,
  onClick,
  ...props
}) => {
  return (
    <Box m={2} display='inline-block' {...props}>
      <Card
        css={`
          transition: 0.2s ease-in-out;
          cursor: pointer;
          &:hover {
            background: ${!selected && 'hsla(0, 0%, 90%, 1)'};
            opacity: 1;
          }
        `}
        onClick={onClick}
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
        width={11}
        height={11}
        border={1}
        borderRadius={2}
        p={3}
        bg={selected ? 'card.account.background' : 'hsla(0, 0%, 90%, 0)'}
        color={selected ? 'card.account.color' : 'colors.core.black'}
      >
        <Box display='flex' alignItems='center' justifyContent='flex-start'>
          <Glyph
            mr={3}
            color={selected ? 'card.account.color' : 'colors.core.black'}
            acronym={index.toString()}
          />
          <Box display='flex' flexDirection='column'>
            <Text fontSize={3} my={0}>
              Address
            </Text>
            <Title fontSize={4} my={0}>
              {truncate(address)}
            </Title>
          </Box>
        </Box>

        <Box display='flex' flexDirection='column'>
          <Text fontSize={3} my={0}>
            Balance
          </Text>
          <Title fontSize={4} my={0}>
            {balance}FIL
          </Title>
        </Box>
      </Card>
    </Box>
  )
}

AccountCardAlt.propTypes = {
  address: ADDRESS_PROPTYPE,
  index: number.isRequired,
  balance: string.isRequired,
  onClick: func.isRequired,
  selected: bool
}

AccountCardAlt.defaultProps = {
  selected: false
}

export default AccountCardAlt
