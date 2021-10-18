import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Button,
  Card,
  Title,
  Text,
  AccountError,
  Loading,
  NetworkSwitcherGlyphV2
} from '@glif/react-components'
import { Input } from '../Shared'

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

const Create = ({ onClick, loading, nextAccountIndex, errorMsg }) => {
  const [accountIndex, setAccountIndex] = useState(nextAccountIndex)
  const [network, setNetwork] = useState<'f' | 't'>('f')

  useEffect(() => setAccountIndex(nextAccountIndex), [nextAccountIndex])

  if (loading) return <LoadingCard />
  if (errorMsg)
    return <AccountError onTryAgain={onClick} errorMsg={errorMsg} m={2} />

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
      <Box width={10}>
        <Input.Text
          /* @ts-ignore */
          label='Account index'
          value={accountIndex}
          onChange={(e) => setAccountIndex(e.target.value)}
        />
      </Box>
      <Box>
        <NetworkSwitcherGlyphV2
          onNetworkSwitch={setNetwork}
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
            setNetwork('f')
            onClick(accountIndex, network)
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
