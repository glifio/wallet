import React from 'react'
import PropTypes from 'prop-types'

import MessageHistoryRowContainer from './MessageHistoryRowContainer'
import { Text } from '../Typography'

const ShowMore = ({ showMore }) => {
  return (
    <MessageHistoryRowContainer
      css={`
        cursor: pointer;
      `}
    >
      <Text
        role='button'
        onClick={showMore}
        color='core.primary'
        width='100%'
        textAlign='center'
      >
        View More
      </Text>
    </MessageHistoryRowContainer>
  )
}

ShowMore.propTypes = {
  showMore: PropTypes.func.isRequired
}

export default ShowMore
