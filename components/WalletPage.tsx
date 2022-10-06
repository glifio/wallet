import {
  Page,
  PageProps,
  PagePropTypes,
  IconWallet
} from '@glif/react-components'

export default function WalletPage({ children, ...rest }: PageProps) {
  return (
    <Page appIcon={<IconWallet />} {...rest}>
      {children}
    </Page>
  )
}

WalletPage.propTypes = {
  ...PagePropTypes
}
