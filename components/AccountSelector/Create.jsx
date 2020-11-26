import React from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Card,
  BaseButton as ButtonCard,
  Title,
  Text,
  Menu,
  MenuItem,
  AccountError,
  Loading
} from '@glif/react-components'

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
  if (loading) return <LoadingCard />
  if (errorMsg)
    return <AccountError onTryAgain={onClick} errorMsg={errorMsg} m={2} />

  return (
    <ButtonCard
      position='relative'
      type='button'
      onClick={onClick}
      display='flex'
      flexWrap='wrap'
      alignContent='flex-start'
      width={11}
      height={11}
      px={3}
      py={3}
      m={2}
      bg='core.transparent'
      borderColor='core.nearblack'
      color='core.nearblack'
      opacity='1'
      cursor='pointer'
    >
      <Box
        position='absolute'
        top='50%'
        left='50%'
        fontSize={7}
        css={`
          transform: translate(-50%, -50%);
        `}
      >
        ＋
      </Box>
      <Menu>
        <MenuItem display='flex' alignItems='center'>
          <Title>Create new account</Title>
        </MenuItem>
        <MenuItem>
          <Text textAlign='left'>
            Click here to create account #{nextAccountIndex}.
          </Text>
        </MenuItem>
      </Menu>
    </ButtonCard>
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
