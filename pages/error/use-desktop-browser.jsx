import React from 'react'
import { useRouter } from 'next/router'
import { IconGlif, Box, BigTitle, Title, Button } from '../../components/Shared'

export default () => {
  const router = useRouter()

  return (
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
        <Title my={5} textAlign='left'>
          Glif Wallet isn&rsquo;t ready for your phone or tablet.
        </Title>
        <Title my={5} textAlign='left'>
          Please access it from your computer instead.
        </Title>
        <Button
          mt={5}
          variant='secondary'
          title='Home'
          onClick={() => router.push('/')}
        />
      </Box>
    </Box>
  )
}
