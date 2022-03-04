import { Page, PageProps, WalletIconHeaderFooter } from '@glif/react-components'

export default function WalletPage({ children, ...rest }: PageProps) {
  return (
    <Page appIcon={<WalletIconHeaderFooter />} {...rest}>
      {children}
    </Page>
  )
}

WalletPage.propTypes = {
  ...Page.propTypes
}
