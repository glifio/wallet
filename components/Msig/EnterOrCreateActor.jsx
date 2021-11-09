import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { validateAddressString } from '@glif/filecoin-address'
import styled from 'styled-components'
import {
  Box,
  Button,
  OnboardCard,
  StepHeader,
  StyledLink,
  Text,
  Title
} from '@glif/react-components'
import { Input } from '../Shared'
import { useMsig } from '../../MsigProvider'
import { IconLedger } from '../Shared/Icons'
import {
  generateRouteWithRequiredUrlParams,
  navigate
} from '../../utils/urlParams'
import { PAGE } from '../../constants'

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
`

const ACTOR_NOT_FOUND_ERR = 'Actor not found'
const NOT_A_SIGNER_ERR =
  'Your wallet is not an owner of this multisig. Please go back and choose a wallet address that is a signer of this multisig.'
const NOT_MSIG_ACTOR_ERR =
  'The actor you entered is not a multisig wallet. Glif only supports multisig actors.'

const EnterActorAddress = () => {
  const { setMsigActor, errors: msigActorErrors, ActorCode } = useMsig()
  const router = useRouter()
  const [err, setErr] = useState('')
  const input = useRef('')

  useEffect(() => {
    if (!err && msigActorErrors.actorNotFound) {
      setErr(ACTOR_NOT_FOUND_ERR)
    }

    if (!err && msigActorErrors.connectedWalletNotMsigSigner) {
      setErr(NOT_A_SIGNER_ERR)
    }

    if (!err && msigActorErrors.notMsigActor) {
      setErr(NOT_MSIG_ACTOR_ERR)
    }

    if (!err && msigActorErrors.unhandledError) {
      setErr(msigActorErrors.unhandledError)
    }
  }, [
    err,
    setErr,
    msigActorErrors.actorNotFound,
    msigActorErrors.connectedWalletNotMsigSigner,
    msigActorErrors.notMsigActor,
    msigActorErrors.unhandledError
  ])

  // once the actor address gets populated in context
  // we push the user to the msig home
  useEffect(() => {
    // as long as there is an ActorCode, we know we successfully retrieved the multisig
    if (!err && !!ActorCode) {
      navigate(router, { pageUrl: PAGE.MSIG_HOME })
    }
  }, [err, router, ActorCode])

  const onSubmit = (e) => {
    e.preventDefault()
    setErr('')
    const trimmedAddr = input.current.value.trim()
    if (!validateAddressString(trimmedAddr)) return setErr('Invalid address.')
    if (Number(trimmedAddr[1]) !== 0 && Number(trimmedAddr[1]) !== 2)
      return setErr('Invalid Actor Address. Second character must be 0 or 2.')
    setMsigActor(trimmedAddr)
  }

  return (
    <Box padding={[2, 3, 5]}>
      <Form autoComplete='on' onSubmit={onSubmit}>
        <OnboardCard>
          <StepHeader currentStep={4} totalSteps={4} Icon={IconLedger} />
          <Title mt={3}>Actor ID</Title>
          <Text>Please input your actor ID address below to continue </Text>
          <Input.Text
            ref={input}
            autoComplete='on'
            label='ID'
            name='ID'
            placeholder='f02'
            error={err}
          />

          <br />
          <Box display='flex' flexDirection='row' alignItems='center'>
            <Text mr={3}>Don&apos;t have a multisig actor ID?</Text>
            <StyledLink
              href={generateRouteWithRequiredUrlParams({
                pageUrl: PAGE.MSIG_CHOOSE
              })}
              name='Create one'
              target='_self'
            />
          </Box>
        </OnboardCard>
        <Box
          mt={6}
          display='flex'
          flexDirection='row'
          justifyContent='space-between'
          width='100%'
          maxWidth={13}
        >
          <Button
            title='Back'
            onClick={router.back}
            variant='secondary'
            mr={2}
          />
          <Button title='Submit' type='submit' variant='primary' ml={2} />
        </Box>
      </Form>
    </Box>
  )
}

export default EnterActorAddress
