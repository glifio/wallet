import React from 'react'
import PropTypes from 'prop-types'

import MessageHistoryRowContainer from './MessageHistoryRowContainer'
import { Text } from '../Typography'
import { MESSAGE_PROPS } from '../../../customPropTypes'

const ShowMore = ({ paginating, showMore, confirmed, total }) => {
  return (
    <>
      {confirmed.length < total && (
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
            {paginating ? 'Loading' : 'View More'}
          </Text>
        </MessageHistoryRowContainer>
      )}
    </>
  )
}

ShowMore.propTypes = {
  paginating: PropTypes.bool.isRequired,
  showMore: PropTypes.func.isRequired,
  confirmed: PropTypes.arrayOf(MESSAGE_PROPS),
  total: PropTypes.number.isRequired
}

export default ShowMore
