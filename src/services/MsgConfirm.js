import React from 'react'
import { useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import FilecoinNumber from '@openworklabs/filecoin-number'
import { Toast } from 'react-bootstrap'
import 'styled-components/macro'

import { shortenAddress, ADDRESS_PROPTYPE } from '../utils'

import { ColoredDot } from '../components/ConnectWallet/styledComponents'
import { confirmedMessage } from '../store/actions'
import { FlexContainer, GREEN } from '../components/StyledComponents'

const Notif = msg => (
  <Toast show>
    <Toast.Body>
      <FlexContainer flexDirection='column'>
        <FlexContainer flexDirection='row'>
          <ColoredDot color={msg.pending ? 'gold' : GREEN} />
          <p
            css={`
              font-weight: bold;
              margin-bottom: 5px;
            `}
          >
            {msg.pending ? 'Transaction pending...' : 'Transaction confirmed.'}
          </p>
        </FlexContainer>
        <hr
          css={`
            margin: 0;
            margin-bottom: 5px;
          `}
        />
        <strong>SENT: </strong>
        {new FilecoinNumber(msg.value, 'attofil').toFil()} FIL
        <strong>TO: </strong>
        {shortenAddress(msg.to)}
        <strong>CID: </strong>
        {shortenAddress(msg.cid)}
      </FlexContainer>
    </Toast.Body>
  </Toast>
)

Notif.propTypes = {
  to: ADDRESS_PROPTYPE,
  cid: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  pending: PropTypes.bool
}

Notif.defaultProps = {
  pending: false
}

export default () => {
  const dispatch = useDispatch()
  const { confirmedMsgs, pendingMsgs, walletProvider } = useSelector(state => ({
    confirmedMsgs: state.messages.confirmed,
    pendingMsgs: state.messages.pending,
    walletProvider: state.walletProvider
  }))
  const listenForMsgConfirmation = useCallback(
    msgCid => {
      let listenerSubscribed = true
      const confirm = async () => {
        if (listenerSubscribed) {
          try {
            const { Receipt } = await walletProvider.jsonRpcEngine.request(
              'StateWaitMsg',
              {
                '/': msgCid
              }
            )
            if (Receipt.ExitCode === 0) {
              dispatch(confirmedMessage(msgCid))
            }
          } catch (err) {
            // TODO: get a proper error message from StateWaitMsg, so we know not to fetch again if a bad error occured
            await confirm(msgCid)
          }
        }
      }
      const unsubscribe = () => (listenerSubscribed = false)
      confirm()
      return unsubscribe
    },
    [dispatch, walletProvider]
  )

  useEffect(() => {
    if (pendingMsgs.length > 0) {
      const unlistenersFuncs = pendingMsgs.map(msg =>
        listenForMsgConfirmation(msg.cid)
      )
      // cleanup effects
      return () => unlistenersFuncs.forEach(unlistener => unlistener())
    }
  }, [listenForMsgConfirmation, dispatch, pendingMsgs])

  return (
    <div
      css={`
        position: absolute;
        right: 24px;
        top: 74px;
        width: 15%;
      `}
    >
      {confirmedMsgs.map(msg => (
        <Notif key={msg.cid} {...msg} />
      ))}
      {pendingMsgs.map(msg => (
        <Notif key={msg.cid} {...msg} pending />
      ))}
    </div>
  )
}
