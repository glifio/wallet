import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useMsig } from '../../../MsigProvider'
import copyToClipboard from '../../../utils/copyToClipboard'

import {
  Box,
  Card,
  Copy,
  Glyph,
  Label,
  Text,
  StyledIconCopyAccountAddress,
  Button,
  BigTitle
} from '../../Shared'
import {
  ADDRESS_PROPTYPE,
  FILECOIN_NUMBER_PROP
} from '../../../customPropTypes'
import makeFriendlyBalance from '../../../utils/makeFriendlyBalance'

const Balances = ({ address, available, total }) => {
  const [copied, setCopied] = useState(false)
  return (
    <Box width='100%'>
      <Card
        p={3}
        border={0}
        borderRadius={2}
        borderWidth={1}
        overflow='hidden'
        display='flex'
        flexDirection='row'
        justifyContent='center'
        maxWidth='380px'
        maxHeight='380px'
        minHeight='380px'
        width='380px'
        height='380px'
        bg='background.screen'
        boxShadow={2}
      >
        <Box
          display='flex'
          flexDirection='column'
          justifyContent='space-between'
          alignItems='center'
          height='100%'
          width='100%'
        >
          <Box
            display='flex'
            flexDirection='row'
            justifyContent='space-between'
            alignItems='center'
            width='100%'
          >
            <Box display='flex' flexDirection='row' alignItems='center'>
              <Glyph mr={3} color='core.primary' acronym='Ac' />
              <Text margin={0} color='core.primary'>
                Account
              </Text>
            </Box>
            <Box display='flex' alignContent='center'>
              <Text
                margin={0}
                overflow='hidden'
                whiteSpace='nowrap'
                color='core.yellow'
              >
                {address}
              </Text>
              <Copy
                display='flex'
                alignItems='center'
                ml={1}
                onClick={() => {
                  setCopied(true)
                  copyToClipboard(address)
                }}
              >
                <StyledIconCopyAccountAddress />
              </Copy>
            </Box>
          </Box>
          <Box display='flex' flexDirection='column'>
            <Label mb={1} textAlign='center'>
              Available
            </Label>
            <BigTitle color='core.primary'>
              {makeFriendlyBalance(available, 6, true)}
            </BigTitle>
          </Box>
          <Button variant='primary' title='Withdraw' onClick={() => {}} />
        </Box>
      </Card>
      <Card>{makeFriendlyBalance(total, 6, true)}</Card>
    </Box>
  )
}

Balances.propTypes = {
  available: FILECOIN_NUMBER_PROP,
  total: FILECOIN_NUMBER_PROP,
  address: ADDRESS_PROPTYPE
}

export default () => {
  const msigActorAddress = useSelector(state => state.msigActorAddress)
  const { Balance, AvailableBalance } = useMsig(msigActorAddress)
  return (
    <Box p={3}>
      <Balances
        address={msigActorAddress}
        available={AvailableBalance}
        total={Balance}
      />
    </Box>
  )
}
