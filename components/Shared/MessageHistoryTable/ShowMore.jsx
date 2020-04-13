import React from 'react'

import MessageHistoryRowContainer from './MessageHistoryRowContainer'
import { Text } from '../Typography'
import useTransactionHistory from '../../Wallet/Message/useTransactionHistory'

export default () => {
  const { paginating, showMore, confirmed, total } = useTransactionHistory()
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
