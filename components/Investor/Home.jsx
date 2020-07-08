import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { color, typography, layout, space, position } from 'styled-system'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import {
  Box,
  Button,
  Input,
  OnboardCard,
  StepHeader,
  Text,
  Title
} from '../Shared'
import { IconLedger } from '../Shared/Icons'
import { encodeInvestorValsForCoinList } from '../../utils/investor'
import copyToClipboard from '../../utils/copyToClipboard'
import noop from '../../utils/noop'
import useWallet from '../../WalletProvider/useWallet'
import { ADDRESS_PROPTYPE } from '../../customPropTypes'

export const Copy = styled.p.attrs(props => ({
  color: 'core.primary',
  margin: 0,
  fontSize: 3,
  ...props
}))`
  width: fit-content;
  transition: 0.18s ease-in-out;
  border-bottom: 2px solid ${props => props.theme.colors.core.primary}00;
  &:hover {
    cursor: pointer;
    border-bottom: 2px solid ${props => props.theme.colors.core.primary};
  }
  ${color}
  ${typography}
  ${layout}
  ${position}
  ${space}
`

const PreConfirm = ({ address, investor }) => {
  return (
    <>
      <StepHeader currentStep={4} totalSteps={5} Icon={IconLedger} />
      <Title mt={3}>Confirm ID and Filecoin address</Title>
      <Text>
        Once confirmed, we&apos;ll generate a unique string for you to
        copy/paste into your CoinList account.
      </Text>
      <Input.Text
        value={investor}
        onChange={noop}
        label='InvestorID'
        disabled
      />
      <Input.Text
        value={address}
        onChange={noop}
        label='Filecoin address'
        disabled
      />
    </>
  )
}

PreConfirm.propTypes = {
  address: ADDRESS_PROPTYPE,
  investor: PropTypes.string.isRequired
}

const PostConfirm = ({ investorString }) => {
  const [copied, setCopied] = useState(false)
  return (
    <>
      <StepHeader currentStep={5} totalSteps={5} Icon={IconLedger} />
      <Text>
        All set! Please log in to your CoinList account and paste this string in
        exactly how it appears.
      </Text>
      <Box display='flex' flexDirection='column' alignItems='flex-end'>
        <Copy
          onClick={() => {
            setCopied(true)
            copyToClipboard(investorString)
          }}
        >
          {copied ? 'Copied' : 'Copy string'}
        </Copy>
        <Text m={0} p={2} bg='background.text'>
          {investorString}
        </Text>
      </Box>
    </>
  )
}

PostConfirm.propTypes = {
  investorString: PropTypes.string.isRequired
}

export default () => {
  const router = useRouter()
  const { investor } = useSelector(state => ({
    investor: state.investor
  }))
  const { address } = useWallet()
  const [confirmed, setConfirmed] = useState(false)
  const [investorString, setInvestorString] = useState('')

  const onClick = () => {
    if (confirmed) window.location.href = 'https://coinlist.co/login'
    else {
      setInvestorString(encodeInvestorValsForCoinList(address, investor))
      setConfirmed(true)
    }
  }

  const back = () => {
    if (confirmed) setConfirmed(false)
    else {
      const params = new URLSearchParams(router.query)
      router.push(`/investor/accounts?${params.toString()}`)
    }
  }

  return (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      width='100%'
      minHeight='100vh'
      alignSelf='center'
      padding={[2, 3, 5]}
    >
      <OnboardCard>
        {confirmed ? (
          <PostConfirm investorString={investorString} />
        ) : (
          <PreConfirm address={address} investor={investor} />
        )}
      </OnboardCard>
      <Box
        mt={6}
        display='flex'
        flexDirection='row'
        justifyContent='space-between'
        width='100%'
        maxWidth={13}
      >
        <Button title='Back' onClick={back} variant='secondary' mr={2} />
        <Button
          title={confirmed ? 'Login to CoinList' : 'Generate string'}
          onClick={onClick}
          variant='primary'
          ml={2}
        />
      </Box>
    </Box>
  )
}
