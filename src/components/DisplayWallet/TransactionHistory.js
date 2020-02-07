import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import 'styled-components/macro'
import FilecoinNumber from '@openworklabs/filecoin-number'
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
  // EmptyHistoryText,
  MessageReviewSubText,
  // UnderlineOnHover,
  BASE_SIZE_UNIT
} from '../StyledComponents'
import { useWallets } from '../../hooks'
import { shortenAddress, ADDRESS_PROPTYPE } from '../../utils'
// import { useDispatch } from 'react-redux'
// import {
//   fetchingNextPage,
//   fetchedNextPageSuccess,
//   fetchedNextPageFailure
// } from '../../store/actions'

const MethodText = styled(MessageReviewSubText)`
  font-weight: bold;
  margin-right: ${BASE_SIZE_UNIT}px;
`

const AlignItemsCenter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const TransactionComponent = ({
  to,
  from,
  value,
  gas_used,
  gasprice,
  cid,
  status,
  selectedWalletAddress
}) => {
  const sent = from === selectedWalletAddress
  return (
    <Transaction>
      <TransactionAmount>
        <AlignItemsCenter
          css={{
            display: 'flex',
            'flex-direction': 'row',
            'align-items': 'center'
          }}
        >
          <MethodText>
            <strong>{sent ? 'SENT: ' : 'RECEIVED: '}</strong>
          </MethodText>
          {new FilecoinNumber(value, 'attofil').toFil()}
        </AlignItemsCenter>
      </TransactionAmount>
      <TransactionStatus>
        <TransactionStatusText>{status}</TransactionStatusText>
      </TransactionStatus>
      <TransactionGas>
        {status.toLowerCase() === 'pending' ? (
          <>
            <strong>Gas price: </strong>
            {gasprice} AttoFil
          </>
        ) : (
          <>
            <strong>Gas used: </strong>
            {gas_used} AttoFil
          </>
        )}
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

TransactionComponent.propTypes = {
  to: ADDRESS_PROPTYPE,
  from: ADDRESS_PROPTYPE,
  value: PropTypes.string.isRequired,
  gasprice: PropTypes.string.isRequired,
  gas_used: PropTypes.number,
  cid: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  selectedWalletAddress: ADDRESS_PROPTYPE
}

const MessageCreator = () => {
  // const {
  //   pending,
  //   links,
  //   confirmed,
  //   loadedSuccess,
  //   loading
  // } = useTransactions()
  const { selectedWallet } = useWallets()
  // const dispatch = useDispatch()
  return (
    <React.Fragment>
      <TransactionHistory
        css={{
          marginBottom: `${BASE_SIZE_UNIT * 10}px`,
          textAlign: 'center'
        }}
      >
        <SectionHeader
          css={{
            marginBottom: `${BASE_SIZE_UNIT * 2}px`,
            marginTop: `${BASE_SIZE_UNIT * 6}px`
          }}
        >
          Transaction History
        </SectionHeader>
        <a
          target='_blank'
          rel='noopener noreferrer'
          href={
            'https://filscan.io/#/address/detail?address=' +
            selectedWallet.address
          }
        >
          See your transaction
        </a>{' '}
        history on filscan.io.
        {/* {pending.length > 0 &&
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
          </UnderlineOnHover> */}
        {/* )}
        {loadedSuccess && pending.length === 0 && confirmed.length === 0 && (
          <EmptyHistoryText>No transactions yet.</EmptyHistoryText>
        )}
        {loading && pending.length === 0 && (
          <EmptyHistoryText>Loading transactions.</EmptyHistoryText>
        )} */}
      </TransactionHistory>
    </React.Fragment>
  )
}

export default MessageCreator
