import React from 'react'
import { ErrorView } from '../../components/Shared'

export default () => {
  return (
    <ErrorView
      title='Disconnected!'
      description='We had trouble connecting to our Filecoin nodes. We are aware of the situation and are working on fixing this as soon as possible.'
      linkhref=''
      linkDisplay=''
    />
  )
}
