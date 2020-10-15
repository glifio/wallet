import React from 'react'
import { ErrorView } from '../../components/Shared'

export default () => {
  return (
    <ErrorView
      title='Unsupported multisig actor!'
      description='We only support single signer multisigs at the moment. Tweet at us if you want us to support multsigners!'
      linkhref=''
      linkDisplay=''
    />
  )
}
