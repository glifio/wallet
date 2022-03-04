import React from 'react'
import { IconGlif, Box, BigTitle, Title, Button } from '@glif/react-components'
import { OneColumnCentered } from '@glif/react-components'
import WalletPage from '../../components/WalletPage'

const UseDesktopBrowser = () => {
  return (
    <WalletPage>
      <OneColumnCentered>
        <Box textAlign='center' px={5}>
          <Box
            display='inline-block'
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
            onClick={() => {
              window.location.href = 'https://www.glif.io'
            }}
          />
        </Box>
      </OneColumnCentered>
    </WalletPage>
  )
}

export default UseDesktopBrowser
