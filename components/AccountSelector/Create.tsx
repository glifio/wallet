import React, { SyntheticEvent, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Button,
  Card,
  Label,
  Title,
  Text,
  AccountError,
  Loading,
  NetworkSwitcherGlyphV2
} from '@glif/react-components'
import { RawNumberInput } from '../Shared/Input/Number'

const LoadingCard = () => (
  <Card
    display='flex'
    flexWrap='wrap'
    alignContent='flex-start'
    width={11}
    height={11}
    m={2}
    bg='core.transparent'
    borderColor='core.primary'
    color='core.primary'
    opacity='1'
  >
    <Box display='flex' flexDirection='row'>
      <Loading />
      <Text ml={2} lineHeight='.5'>
        Loading
      </Text>
    </Box>
  </Card>
)

const Create = ({
  onClick,
  loading,
  nextAccountIndex,
  errorMsg
}: {
  onClick: (_index: number, _network: 'f' | 't') => void
  loading: boolean
  nextAccountIndex: number
  errorMsg?: string
}) => {
  const [accountIndex, setAccountIndex] = useState<number>(
    Number(nextAccountIndex)
  )
  const [accountIndexErr, setAccountIndexErr] = useState<string>('')
  const [network, setNetwork] = useState<'f' | 't'>('f')

  if (loading) return <LoadingCard />
  if (errorMsg)
    return (
      <AccountError
        onClick={() => {
          setNetwork('f')
          onClick(accountIndex, network)
        }}
        errorMsg={errorMsg}
        m={2}
      />
    )

  return (
    <Card
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      width={11}
      height={11}
      border={1}
      borderRadius={2}
      px={3}
      py={3}
      m={2}
      bg='hsla(0, 0%, 90%, 0)'
      color='colors.core.black'
    >
      <Title my={2}>Create new account</Title>

      <Box>
        <Box
          display='flex'
          flexDirection='row'
          alignItems='center'
          justifyContent='center'
          maxWidth={11}
        >
          <Label width='50%'>Account index</Label>
          <RawNumberInput
            width='50%'
            borderRadius={2}
            onFocus={() => setAccountIndexErr('')}
            value={accountIndex}
            onChange={(e: SyntheticEvent) => {
              setAccountIndexErr('')
              const target = e.target as HTMLInputElement
              const num = Number(target.value)
              if (!isNaN(num)) setAccountIndex(num)
              else setAccountIndexErr('Account index must be a number')
            }}
          />
        </Box>
        {accountIndexErr && (
          <Text
            p={0}
            m={0}
            fontSize='15px'
            textAlign='right'
            color='status.fail.background'
          >
            {accountIndexErr}
          </Text>
        )}
      </Box>
      <Box>
        <NetworkSwitcherGlyphV2
          onNetworkSwitch={(network: 't' | 'f') => setNetwork(network)}
          network={network}
        />
        {network === 't' && (
          <Text p={0} m={0} fontSize='15px' textAlign='left'>
            {'*Not recommended'}
          </Text>
        )}
      </Box>
      <Box
        width='100%'
        display='flex'
        flexDirection='row'
        justifyContent='flex-end'
      >
        <Button
          title='Create'
          onClick={() => {
            onClick(accountIndex, network)
            setNetwork('f')
            setAccountIndex(nextAccountIndex + 1)
          }}
          variant='secondary'
        />
      </Box>
    </Card>
  )
}

Create.propTypes = {
  onClick: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  nextAccountIndex: PropTypes.number.isRequired,
  errorMsg: PropTypes.string
}

Create.defaultProps = {
  errorMsg: ''
}

export default Create
