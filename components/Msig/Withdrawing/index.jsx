import React, { useState } from 'react'
import PropTypes from 'prop-types'

import {
  Box,
  Button,
  FloatingContainer,
  StepHeader,
  Input,
  Text,
  Glyph
} from '../../Shared'
import {
  ADDRESS_PROPTYPE,
  FILECOIN_NUMBER_PROP
} from '../../../customPropTypes'
import makeFriendlyBalance from '../../../utils/makeFriendlyBalance'

const CardHeader = ({ address, balance }) => {
  return (
    <Box
      width='100%'
      p={3}
      border={1}
      borderTopRightRadius={3}
      borderTopLeftRadius={3}
      bg='core.primary'
      color='core.white'
    >
      <Box
        display='flex'
        flexDirection='row'
        alignItems='center'
        justifyContent='space-between'
      >
        <Box display='flex' flexDirection='row'>
          <Glyph acronym='Ac' color='white' mr={3} />
          <Box display='flex' flexDirection='column' alignItems='flex-start'>
            <Text m={0}>From</Text>
            <Text m={0}>{address}</Text>
          </Box>
        </Box>
        <Box display='flex' flexDirection='column' alignItems='flex-start'>
          <Text m={0}>Balance</Text>
          <Text m={0}>{makeFriendlyBalance(balance, 6, true)} FIL</Text>
        </Box>
      </Box>
    </Box>
  )
}

CardHeader.propTypes = {
  address: ADDRESS_PROPTYPE,
  balance: FILECOIN_NUMBER_PROP
}

const Withdrawing = ({ address, balance }) => {
  const [step, setStep] = useState(1)
  const [toAddress, setToAddress] = useState('')
  const [toAddressError, setToAddressError] = useState('')
  return (
    <>
      <Box
        width='100%'
        display='flex'
        flexDirection='column'
        alignItems='center'
      >
        <Box
          maxWidth={14}
          width={13}
          minWidth={12}
          display='flex'
          flexDirection='column'
          justifyContent='space-between'
        >
          <Box>
            <StepHeader
              title='Withdrawing Filecoin'
              currentStep={1}
              totalSteps={3}
              glyphAcronym='Wd'
            />
            <Text textAlign='center'>
              First, please confirm the account you&apos;re sending from, and
              the recipient you want to send to.
            </Text>
            <CardHeader address={address} balance={balance} />
            <Box width='100%' p={3} border={0} bg='background.screen'>
              <Text m={0}>Recipient</Text>
              <Input.Address
                value={toAddress}
                onChange={e => setToAddress(e.target.value)}
                setError={setToAddressError}
                error={toAddressError}
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <FloatingContainer>
        <Button variant='secondary' title='Cancel' />
        <Button variant='primary' title='Next' />
      </FloatingContainer>
    </>
  )
}

Withdrawing.propTypes = {
  address: ADDRESS_PROPTYPE,
  balance: FILECOIN_NUMBER_PROP
}

export default Withdrawing
