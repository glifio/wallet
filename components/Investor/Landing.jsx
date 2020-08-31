import React from 'react'
import { Box, Title, HeaderGlyph, Header } from '../Shared'

export default () => {
  return (
    <Box
      display='flex'
      flexWrap='wrap'
      alignItems='center'
      justifyContent='center'
      flexGrow='1'
      p={[2, 3, 5]}
    >
      <Box
        display='flex'
        maxWidth={13}
        width={['100%', '100%', '40%']}
        flexDirection='column'
        alignItems='flex-start'
        alignContent='center'
        mb={4}
      >
        <HeaderGlyph
          alt='Source: https://unsplash.com/photos/g2Zf3hJyYAc'
          text='SAFT'
          imageUrl='/imgwallet.png'
        />

        <Box
          display='flex'
          flexDirection='column'
          mt={[2, 4, 4]}
          alignSelf='center'
          textAlign='left'
        >
          <Header>Use your Ledger device to hold your Filecoin SAFT.</Header>
          <Title color='core.primary' mt={3} lineHeight='140%'>
            Coming THIS WEEK.
          </Title>
        </Box>
      </Box>
    </Box>
  )
}
