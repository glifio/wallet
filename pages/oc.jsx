import React from 'react'
import { Input, Menu, MenuItem, Box, Title } from '../components/Shared'

const MnemonicObjectRow = () => {
  return (
    <Menu display='flex' flexWrap='wrap' justifyContent='space-around'>
      <MenuItem>
        <Input.MnemonicWord num={1} valid value='charlie' />
      </MenuItem>
      <MenuItem>
        <Input.MnemonicWord num={2} value='rajon' />
      </MenuItem>
      <MenuItem>
        <Input.MnemonicWord num={3} />
      </MenuItem>
    </Menu>
  )
}
export default () => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyItems='center'
      maxWidth={16}
      p={4}
      border={1}
      borderRadius={2}
    >
      <Box width='100%' textAlign='left' px={4} mb={4}>
        <Title>Your Seed Phrase</Title>
      </Box>
      <Menu
        display='flex'
        alignItems='center'
        justifyItems='center'
        flexWrap='wrap'
      >
        <MenuItem>
          <MnemonicObjectRow />
        </MenuItem>
      </Menu>
    </Box>
  )
}
