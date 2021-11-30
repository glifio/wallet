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
  NetworkSwitcherGlyphV2 as CoinTypeSwitcherGlyph,
  StyledATag
} from '@glif/react-components'
import { CoinType } from '@glif/filecoin-address'
import { RawNumberInput } from '../Shared/Input/Number'

const COIN_TYPE = process.env.COIN_TYPE! as CoinType

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
  onClick: (_index: number, _coinType: CoinType) => void
  loading: boolean
  nextAccountIndex: number
  errorMsg?: string
}) => {
  const [accountIndex, setAccountIndex] = useState<number>(
    Number(nextAccountIndex)
  )
  const [accountIndexErr, setAccountIndexErr] = useState<string>('')
  const [coinType, setCoinType] = useState<CoinType>(COIN_TYPE)
  if (loading) return <LoadingCard />
  if (errorMsg)
    return (
      <AccountError
        onClick={() => {
          setCoinType(CoinType.MAIN)
          onClick(accountIndex, coinType)
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
        <CoinTypeSwitcherGlyph
          onNetworkSwitch={(coinType: CoinType) => setCoinType(coinType)}
          network={coinType}
        />
        {coinType === 't' ? (
          <Text p={0} m={0} fontSize='15px' textAlign='left'>
            {'*Not recommended'}
          </Text>
        ) : (
          <>
            {/* Hack to get around margin limitations here... */}
            <Box height={1} />
            <StyledATag
              href='https://reading.supply/@glif/not-seeing-the-right-address-when-accessing-the-glif-wallet-NE1FhV'
              color='core.primary'
              p={0}
              m={0}
              fontSize='15px'
              ml={1}
            >
              Legacy address?
            </StyledATag>
          </>
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
            onClick(accountIndex, coinType)
            setCoinType(CoinType.MAIN)
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
