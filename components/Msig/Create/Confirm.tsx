import React, { SyntheticEvent, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { func, string } from 'prop-types'
import { useRouter } from 'next/router'
import {
  Card,
  Box,
  IconPending,
  StyledATag,
  Button,
  Text,
  Glyph,
  Title
} from '@glif/react-components'
import ConfirmMessage from '../../../lib/confirm-message'
import { useMsig } from '../../../MsigProvider'
import { clearMessages } from '../../../store/actions'
import converAddrToFPrefix from '../../../utils/convertAddrToFPrefix'
import { fetchAndSetMsigActor } from '../../../utils/msig'
import { EXEC_ACTOR, PAGE } from '../../../constants'
import { navigate } from '../../../utils/urlParams'
import { initialState } from '../../../store/states'

const NextOption = ({
  text,
  onClick
}: {
  text: string
  onClick: (_: SyntheticEvent) => void
}) => {
  return (
    <Button
      title={text}
      display='flex'
      flexWrap='wrap'
      alignItems='center'
      mr={2}
      my={3}
      bg='core.transparent'
      borderColor='core.primary'
      color='core.primary'
      opacity='1'
      onClick={onClick}
      css={`
        &:hover {
          cursor: pointer;
        }
      `}
    />
  )
}

NextOption.propTypes = {
  text: string.isRequired,
  onClick: func.isRequired
}

const Confirm = () => {
  const dispatch = useDispatch()
  const [msigError, setMsigError] = useState('')
  const { setMsigActor, Address } = useMsig()
  const { pending, confirmed } = useSelector(
    (s: typeof initialState) => s.messages
  )
  // the create message is the one sent to the f01 actor
  const createMsigMessage = pending.find(
    m => EXEC_ACTOR === converAddrToFPrefix(m.to)
  )

  const { current: msgCid }: { current: string } = useRef(
    createMsigMessage?.cid
  )
  const router = useRouter()

  useEffect(() => {
    if (confirmed.some(m => m.cid === msgCid)) {
      fetchAndSetMsigActor(msgCid, setMsigActor, setMsigError)
    }
  }, [confirmed, msgCid, setMsigActor, setMsigError])

  if (msigError) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        width='100%'
        minHeight='100vh'
        p={3}
      >
        <Box display='flex' justifyContent='center' flexDirection='column'>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Title ml={2}>
              There was an error when creating your multisig.
            </Title>
          </Box>
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Text mr={2}>With CID: </Text>
            <StyledATag href={`https://filfox.info/en/message/${msgCid}`}>
              {msgCid}
            </StyledATag>
            <br />
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box
      display='flex'
      justifyContent='center'
      width='100%'
      minHeight='100vh'
      p={3}
    >
      {Address ? (
        <Box p={5}>
          <Title>Your multisig has been created.</Title>
          <Card
            maxWidth={13}
            width='100%'
            my={3}
            bg='background.screen'
            boxShadow={2}
            border={0}
          >
            <Glyph acronym='Ms' />
            <Text my={0} mt={3} color='core.darkgray'>
              Your Address{' '}
            </Text>
            <Text mt={2}>{Address}</Text>
          </Card>
          <Text>What would you like to do?</Text>
          <Box display='flex' justifyContent='space-between'>
            <NextOption
              text='Go to Multisig home'
              onClick={() => {
                dispatch(clearMessages())
                navigate(router, { pageUrl: PAGE.MSIG_HOME })
              }}
            />
          </Box>
        </Box>
      ) : (
        <>
          <ConfirmMessage />
          {pending.length > 0 && (
            <Box display='flex' justifyContent='center' flexDirection='column'>
              <Box display='flex' justifyContent='center' alignItems='center'>
                <IconPending />
                <Text ml={2}>
                  We&apos;re waiting for your transaction to confirm.
                </Text>
              </Box>
              <Box display='flex' justifyContent='center' alignItems='center'>
                <Text mr={2}>With CID: </Text>
                <StyledATag href={`https://filfox.info/en/message/${msgCid}`}>
                  {msgCid}
                </StyledATag>
                <br />
              </Box>
              <Text>
                This screen will automatically show you your new Multisig wallet
                address once the transaction confirms.
              </Text>
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

export default Confirm
