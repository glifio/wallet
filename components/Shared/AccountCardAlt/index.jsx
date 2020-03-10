import React from 'react'
import { string, number, bool, func } from 'prop-types'
import { ADDRESS_PROPTYPE } from '../../../customPropTypes'
import Box from '../Box'
import Glyph from '../Glyph'
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
    <Box my={2} display='flex' flexDirection='column' {...props}>
      {selected && (
        <Text my={1} width='100%' textAlign='left' color='core.primary'>
          CURRENT
        </Text>
      )}
      <Box
        css={`
          transition: 0.2s ease-in-out;
          cursor: pointer;
        `}
        onClick={onClick}
        display='flex'
        flexDirection='row'
        justifyContent='space-between'
        width='100%'
        height={8}
        border={1}
        borderRadius={2}
        p={3}
        bg={selected ? 'card.account.background' : 'colors.core.white'}
        color={selected ? 'card.account.color' : 'colors.core.black'}
        boxShadow={1}
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
      </Box>
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
