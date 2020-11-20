import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { func, string } from 'prop-types'
import { useRouter } from 'next/router'
import ConfirmMessage from '../../../lib/confirm-message'
import {
  Card,
  Box,
  IconPending,
  StyledATag,
  Button,
  Text,
  Glyph,
  Title,
} from '../../Shared'
import { fetchAndSetMsigActor } from '../../../store/actions'

const NextOption = ({ text, onClick }) => {
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
  const { pending, confirmed } = useSelector(s => s.messages)
  const msgCid = useRef(pending[0]?.cid)
  const msigAddr = useSelector(s => s.msigActorAddress)
  const router = useRouter()

  useEffect(() => {
    if (confirmed.some(m => m.cid === msgCid.current)) {
      dispatch(fetchAndSetMsigActor(msgCid.current))
    }
  }, [confirmed, dispatch])

  return (
    <Box
      display='flex'
      justifyContent='center'
      width='100%'
      minHeight='100vh'
      p={3}
    >
      {msigAddr ? (
        <Box p={5}>
          <Title>Your multisig has been created.</Title>
            <Card maxWidth={13} width='100%' my={3} bg='background.screen' boxShadow={2} border={0}>
            <Glyph acronym='Ms' />
            <Text my={0} mt={3} color='core.darkgray'>Your Address </Text>
            <Text mt={2}>{msigAddr}</Text>
            </Card>
          <Text>What would you like to do?</Text>
          <Box display='flex' justifyContent='space-between'>
            <NextOption
              text='Go to Multisig home'
              onClick={() => {
                const searchParams = new URLSearchParams(router.query)
                router.push(`/vault/home?${searchParams.toString()}`)
              }}
            />
            <NextOption
              text='Print multisig details'
              onClick={() => {
                const searchParams = new URLSearchParams({
                  ...router.query,
                  address: msigAddr
                })
                router.push(`/vault/print?${searchParams.toString()}`)
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
                <StyledATag
                  href={`https://filfox.info/en/message/${msgCid.current}`}
                >
                  {msgCid.current}
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
