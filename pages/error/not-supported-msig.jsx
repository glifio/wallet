import React from 'react'
import { ErrorView } from '@glif/react-components'

const NotSupportedMsig = () => {
  return (
    <ErrorView
      title='Unsupported multisig actor!'
      description='We only support single signer multisigs at the moment. Tweet at us if you want us to support multsigners!'
      linkhref=''
      linkDisplay=''
    />
  )
}

export default NotSupportedMsig
