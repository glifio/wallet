import React from 'react'
import {
  ButtonV2Link,
  ShadowBox,
  Dialog,
  ButtonRowCenter
} from '@glif/react-components'
import { OneColumnCentered } from '@glif/react-components'
import WalletPage from '../../components/WalletPage'

const UseDesktopBrowser = () => {
  return (
    <WalletPage>
      <OneColumnCentered>
        <Dialog>
          <ShadowBox>
            <h2>Not yet</h2>
            <hr />
            <p>Glif Wallet isn&rsquo;t ready for your phone or tablet.</p>
            <p>Please access it from your computer instead.</p>
          </ShadowBox>
          <ButtonRowCenter>
            <ButtonV2Link large green href={process.env.NEXT_PUBLIC_HOME_URL}>
              Home
            </ButtonV2Link>
          </ButtonRowCenter>
        </Dialog>
      </OneColumnCentered>
    </WalletPage>
  )
}

export default UseDesktopBrowser
