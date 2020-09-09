import React from 'react'
import { ErrorView } from '../../components/Shared'

export default () => {
  return (
    <ErrorView
      title='Bad actor!'
      description='The actor address you entered does not appear to be a multisig actor.'
      linkhref=''
      linkDisplay=''
    />
  )
}
