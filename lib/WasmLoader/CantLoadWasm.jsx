import React from 'react'
import { Box, Button, BigTitle, Title, IconGlif } from '@glif/react-components'

const CantLoadWasm = () => (
  <Box
    display='flex'
    alignItems='center'
    justifyContent='center'
    minHeight='100vh'
    width='100%'
    p={4}
  >
    <Box textAlign='center' px={5}>
      <Box
        display='inline-block'
        margin='0 auto'
        borderRadius={3}
        py={3}
        px={2}
        border={1}
        borderColor='status.fail.background'
        bg='status.fail.background'
      >
        <IconGlif fill='status.fail.foreground' size={7} />
      </Box>
      <BigTitle my={5}>Not yet</BigTitle>
      <Title my={5} textAlign='center'>
        Glif Wallet isn&rsquo;t ready for your browser.
      </Title>
      <Title my={5} textAlign='center'>
        Please access it from Google Chrome on your computer instead.
      </Title>
      <Button
        mt={5}
        variant='secondary'
        title='Home'
        onClick={() => {
          window.location.href = 'https://www.glif.io'
        }}
      />
    </Box>
  </Box>
)

export default CantLoadWasm
