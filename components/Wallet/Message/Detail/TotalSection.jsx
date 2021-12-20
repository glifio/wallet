import React from 'react'
import { string } from 'prop-types'
import { FilecoinNumber } from '@glif/filecoin-number'
import { Box, Title as Total, Num } from '@glif/react-components'

import {
  MESSAGE_PROPS,
  FILECOIN_NUMBER_PROP
} from '../../../../customPropTypes'
import { EXEC, PROPOSE, SEND } from '../../../../constants'

const TotalContainer = ({ total }) => (
  <Box
    display='flex'
    flexDirection='row'
    alignItems='flex-start'
    justifyContent='space-between'
    mt={5}
    mx={1}
  >
    <Total mt={1} fontSize={4} alignSelf='flex-start'>
      Total
    </Total>
    <Box display='flex' flexDirection='column' textAlign='right' pl={4}>
      <Num
        size='l'
        css={`
          word-wrap: break-word;
        `}
        color='core.primary'
      >
        {total} FIL
      </Num>
    </Box>
  </Box>
)

TotalContainer.propTypes = {
  total: string.isRequired
}

const ProposeDetails = ({ message }) => {
  if (message.params.method === 0) {
    return (
      <TotalContainer
        total={new FilecoinNumber(message.params.value, 'attofil').toFil()}
      />
    )
  }

  return <NoTotal />
}

ProposeDetails.propTypes = {
  message: MESSAGE_PROPS
}

const NoTotal = () => {
  return <></>
}

const TotalSection = ({ message, fee }) => {
  switch (message.method) {
    case SEND:
      return (
        <TotalContainer
          total={new FilecoinNumber(message.value, 'attofil')
            .plus(fee)
            .toString()}
        />
      )
    case PROPOSE:
      return <ProposeDetails message={message} />
    case EXEC:
      return <NoTotal />
    default:
      return <NoTotal />
  }
}

TotalSection.propTypes = {
  message: MESSAGE_PROPS.isRequired,
  fee: FILECOIN_NUMBER_PROP
}

export default TotalSection
