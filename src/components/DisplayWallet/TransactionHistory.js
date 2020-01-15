import React from 'react'
import styled from 'styled-components'
import 'styled-components/macro'
import {
  TransactionHistory,
  Transaction,
  TransactionAmount,
  TransactionActorAddress,
  TransactionStatus,
  TransactionGas,
  TransactionMessageHash,
  SectionHeader,
  TransactionStatusText,
  EmptyHistoryText,
  MessageReviewSubText,
  UnderlineOnHover
} from '../StyledComponents'
import { useTransactions, useWallets } from '../../hooks'
import { shortenAddress } from '../../utils'
import { useDispatch } from 'react-redux'
import {
  fetchingNextPage,
  fetchedNextPageSuccess,
  fetchedNextPageFailure
} from '../../store/actions'

const MethodText = styled(MessageReviewSubText)`
  font-weight: bold;
  margin-right: 5px;
`

const TransactionComponent = ({
  to,
  from,
  value,
  gasprice,
  cid,
  status,
  selectedWalletAddress
}) => {
  const sent = from === selectedWalletAddress
  return (
    <Transaction>
      <TransactionAmount>
        <div
          css={{
            display: 'flex',
            'flex-direction': 'row',
            'align-items': 'center'
          }}
        >
          <MethodText>
            <strong>{sent ? 'SENT: ' : 'RECEIVED: '}</strong>
          </MethodText>
          {value.toString()}
        </div>
      </TransactionAmount>
      <TransactionStatus>
        <TransactionStatusText>{status}</TransactionStatusText>
      </TransactionStatus>
      <TransactionGas>
        <strong>Gas: </strong>
        {gasprice} FIL
      </TransactionGas>
      {sent ? (
        <TransactionActorAddress>
          <strong>To:</strong> {shortenAddress(to)}
        </TransactionActorAddress>
      ) : (
        <TransactionActorAddress>
          <strong>From:</strong> {shortenAddress(from)}
        </TransactionActorAddress>
      )}
      <TransactionMessageHash>
        <strong>Message hash:</strong> {shortenAddress(cid)}
      </TransactionMessageHash>
    </Transaction>
  )
}

const MessageCreator = () => {
  const {
    pending,
    links,
    confirmed,
    loadedSuccess,
    loading
  } = useTransactions()
  const { selectedWallet } = useWallets()
  const dispatch = useDispatch()
  return (
    <React.Fragment>
      <TransactionHistory>
        <SectionHeader css={{ marginBottom: '10px', marginTop: '30px' }}>
          Transaction History
        </SectionHeader>
        {pending.length > 0 &&
          pending.map(tx => {
            return (
              <TransactionComponent
                key={tx.cid}
                {...tx}
                status='Pending'
                selectedWalletAddress={selectedWallet.address}
              />
            )
          })}

        {confirmed.length > 0 &&
          confirmed.map(tx => {
            return (
              <TransactionComponent
                key={tx.cid}
                {...tx}
                status='Confirmed'
                selectedWalletAddress={selectedWallet.address}
              />
            )
          })}

        {links.next && (
          <UnderlineOnHover
            role='button'
            rel='noopener noreferrer'
            onClick={async () => {
              dispatch(fetchingNextPage())
              try {
                const result = await (
                  await fetch(
                    `${process.env.REACT_APP_CHAINWATCH_API_SERVER_ENDPOINT}/api/v0/${links.next}`
                  )
                ).json()
                if (result.status === 'success') {
                  dispatch(fetchedNextPageSuccess(result.data, result.links))
                } else if (result.status === 'failed') {
                  dispatch(fetchedNextPageFailure(result.data))
                }
              } catch (err) {
                dispatch(fetchedNextPageFailure(err))
              }
            }}
            css={{ marginBottom: '10px', marginTop: '30px' }}
          >
            More
          </UnderlineOnHover>
        )}

        {loadedSuccess && pending.length === 0 && confirmed.length === 0 && (
          <EmptyHistoryText>No transactions yet.</EmptyHistoryText>
        )}

        {loading && pending.length === 0 && (
          <EmptyHistoryText>Loading transactions.</EmptyHistoryText>
        )}
      </TransactionHistory>
    </React.Fragment>
  )
}

export default MessageCreator
